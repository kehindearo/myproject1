import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import Report from "../models/Report.js";
import Trip from "../models/Trip.js";
import { sendSms } from "../services/sms/termii.js";

export const triggerSos = asyncHandler(async (req, res) => {
  const { tripId, lat, lng } = req.body;
  const trip = await Trip.findById(tripId).populate("driver", "fullName phone");
  if (!trip) throw new ApiError(404, "Trip not found");

  const mapsLink = lat && lng ? `https://maps.google.com/?q=${lat},${lng}` : "location unavailable";
  const message =
    `EMERGENCY: ${req.user.fullName} triggered SOS on Collabo Travel. ` +
    `Driver: ${trip.driver.fullName} (${trip.driver.phone || "n/a"}). Trip ID: ${trip._id}. Location: ${mapsLink}`;

  await Promise.all(
    (req.user.trustedContacts || []).map((c) => sendSms({ to: c.phone, message }))
  );
  if (req.user.emergencyContact?.phone) {
    await sendSms({ to: req.user.emergencyContact.phone, message });
  }

  const report = await Report.create({
    reporter: req.user._id,
    trip: trip._id,
    type: "sos",
    detail: "SOS triggered from active trip",
    severity: "critical",
    location: lat && lng ? { type: "Point", coordinates: [lng, lat] } : undefined,
  });

  req.app.get("io")?.to("admin:room").emit("sos:triggered", { reportId: report._id, tripId: trip._id, userId: req.user._id });

  res.json({ success: true, message: "Trusted contacts and safety team notified" });
});

export const fileReport = asyncHandler(async (req, res) => {
  const { tripId, type, detail } = req.body;
  const report = await Report.create({ reporter: req.user._id, trip: tripId, type, detail });
  res.status(201).json({ success: true, report });
});

export const updateTrustedContacts = asyncHandler(async (req, res) => {
  const { trustedContacts, emergencyContact } = req.body;
  if (trustedContacts) req.user.trustedContacts = trustedContacts.slice(0, 3);
  if (emergencyContact) req.user.emergencyContact = emergencyContact;
  await req.user.save();
  res.json({ success: true, user: req.user });
});

/** Fires SMS to trusted contacts at trip start/end per the safety spec. */
export async function notifyTrustedContactsTripEvent(user, trip, event) {
  const message = `Collabo Travel: ${user.fullName}'s trip ${event} — ${trip.origin.state} → ${trip.destination.state}.`;
  await Promise.all((user.trustedContacts || []).map((c) => sendSms({ to: c.phone, message })));
}
