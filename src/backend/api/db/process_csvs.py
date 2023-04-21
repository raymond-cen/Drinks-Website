#!/usr/bin/env python3

import csv

ingtags = dict()
tags_index = 1
tags = dict()

with open("ingredients.csv", "r") as f:
    reader = csv.reader(f)
    next(reader)

    tags['non-alcoholic'] = 1
    tags_index += 1

    for x, y, z in reader:
        ingtags[x] = set()
        for tag in z.split(","):
            tag = tag.strip()
            if len(tag) == 0:
                continue
            if tag not in tags:
                tags[tag] = tags_index
                tags_index += 1
            tag_number = tags[tag]
            ingtags[x].add(tag_number)

with open("tags.csv", "w+") as f:
    f.write("tagid,name\n");
    for tag in tags:
        f.write("{},{}\n".format(tags[tag], tag))

with open("ingredient_has_tag.csv", "w+") as f:
    f.write("ingredient,tag\n");
    for ing in ingtags:
        for tag in ingtags[ing]:
            f.write("{},{}\n".format(ing, tag))

rectags = dict()
alcoholic = set()

with open("recipe_ingreds.csv") as f:
    reader = csv.reader(f)
    next(reader)

    for recipe, ing, x, y in reader:
        if recipe not in rectags:
            rectags[recipe] = set()
        if ing in ingtags:
            for tag in ingtags[ing]:
                rectags[recipe].add(tag)
                if tag == tags['alcohol']:
                    alcoholic.add(recipe)

    for recipe in rectags:
        if recipe not in alcoholic:
            rectags[recipe].add(tags['non-alcoholic'])

with open("has_tags.csv", "w+") as f:
    f.write("recipe,tag\n")
    for rec in rectags:
        for tag in rectags[rec]:
            f.write("{},{}\n".format(rec, tag))
