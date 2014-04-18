# DrupalCores
![count all the git commits](https://github.com/ericduran/drupalcores/raw/pystart/img.jpg)


Node.js script to parse all the git commit, aggregate every users commit count and generate
a json file with all the contributes and commit counts.
In the gh-pages branch is a angular js page with shows the json file.

## Instructions
First you need to clone a copy of the drupal 8 branch into your drupalcores directory

    git clone --branch 8.x http://git.drupal.org/project/drupal.git
    git clone --branch gh-pages git@github.com:ericduran/drupalcores.git pages

Once you have a git repo of drupal core in the drupal directory then you can run the update.js script

    node update.js

For the company list do:

    ./companies.rb > pages/companies.html

Takes a long time for the first parsing... (~1.5h)
After that it uses the company_mapping.yml and company_infos.yml.

The companies.rb accepts a parameter to either force a update of all people and companies (--update-all)
or to update people, which were not found (--update-not-found).

View online:
 [DrupalCores](http://ericduran.github.com/drupalcores/)

Do you only want the data?
 [BAM!!!](http://ericduran.github.io/drupalcores/data.json)

##Help:

If you want to help please just fork the project and issue a pull request.
