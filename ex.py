from multiprocessing.sharedctypes import Value


favorite_languages = {
 'jen': ['python', 'ruby'],
 'sarah': ['c'],
 'edward': ['ruby', 'go'],
 'phil': ['python', 'haskell'],
 }
for name , languages in favorite_languages.items():
    if len(languages) in favorite_languages < 2:
        print("\n" + name.title() + "'s favorite languages is:")
        for language in languages:
            print("\t" + language.title())
    else:
        print("\n" + name.title() + "'s favorite languages are:")
        for language in languages:
            print("\t" + language.title())

