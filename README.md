![Scrumbot logo](/frontend/public/assets/scrum_bot_icon_128.png "Scrumbot logo")

# Scrumbot

An open-source simple standup meeting assistant for Slack.

In addition to being useful in of itself, scrumbot illustrates
the advanced serverless programming features that the Red Sift platform provides.

- Multiple serverless functions working together to provide a complete application
- Statefulness via a builtin key/value store
- Select and join on stores to allow map/reduce and many other patterns
- A single JSON file to specify the complete Direct Acyclic Graph and all inputs and outputs.
- Desktop development environment and simple deployment via Github.
- Nice visualisations (see below)

![Scrumbot DAG](/frontend/public/assets/dagviz.png "Scrumbot Visualisation")
## Installation

You can install the Scrumbot from its [Web page](http://scrumbot.sifts.io/ "Scrumbot Website").

## Versions

This repository contains a branch (tutorial) which reflects the screencast on how to write
a scrumbot on [YouTube](https://www.youtube.com/watch?v=RJZGaaEWEsc&t=865s),
and a slightly different one (release) which reflects the version used for the Slack
directory. The tutorial omits some details required for submission to the Slack
App directory, like the help command, and some code which covers edge conditions.

## Contributing

Feel free to fork the project and use it as you wish. If you think that others might benefit from your changes, send us a pull request.

## About Redsift

This bot was built using [Red Sift](https://redsift.com "Red Sift Website"). for more information on our serverless computation platform please refer to our [docs](https://docs.redsift.com "Red Sift Docs").

## License

[ISC](LICENSE.TXT)
