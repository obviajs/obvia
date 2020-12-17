# Obvia
Obvia is an MIT-licensed open source Javascript framework created to make the development of single page applications as easy and obvious as possible. It is designed with the objective of being easy to work with, separating code from data, separating structural components (layout) from functional components and allowing embedded state and history management. Obvia consists of UI components, application and applets, general use libraries, and code generation utilities.

## Browser Compatibility
Obvia supports all browsers that are ES5-compliant (IE8 and below are not supported).

## Documentation
To check out the documents and live examples, please visit [obviajs.com]

## Questions
For questions and support, please use the community [chat]. The issue list of this repository is **exclusively** for bug reports and feature requests.

## Issues
Before reporting an issue, please read the [Issue Reporting Guidelines]. Issues that do not follow the guidelines may get closed.

## Want to Help?
If you would like to contribute some code or improve the documentation, please read our [Contribution Guidelines] then check out the current issues. Your work is always appreciated!

## Libraries
This is a list of all the open source libraries used in the Obvia framework.
[yaml.js]\
[tokenize.js]\
[micro-requirejs]\
[Deep Clone]\
[Get Font Awesome Icon from MIME]\
[Debounce decorator]\
[CSS hasStyleRule]\
[Coroutine]\
[MD5 (Message-Digest Algorithm)]

## Roadmap
This is a basic roadmap with some instructions to keep in mind when working with Obvia.

* The implementation class is to be named according to the applet anchor
* Implement the dependency injection
* Create a dependency info-structure
* Create a base-dependent type to return dependencies-related information (array of dependencies info-structure)
* Implementations will be dependent types
* Create a Factory Implementation to support the autowiring of dependencies
* Create the info structure for the types which the Factory will create/return instances of
* An Applet will not create the implementation instance directly but will ask the Factory for it
* The Applet (& App) should handle URL hash changes via an external dependency (the existing logic is to be wrapped in a default provider)
* The security is to be provided by external dependencies

## Contribution
Thank you to everyone who has contributed to ***Obvia***!
If you would like to financially support Obvia's development, please consider making a donation on our [PayPal].

## License
[MIT]

[obviajs.com]: https://obviajs.com/
[Issue Reporting Guidelines]: https://github.com/obviajs/obvia/blob/master/.github/CONTRIBUTING.md#issue-reporting-guidelines
[Contribution Guidelines]: https://github.com/obviajs/obvia/blob/master/.github/CONTRIBUTING.md
[PayPal]: https://paypal.me/obviajs
[MIT]: https://opensource.org/licenses/MIT
[chat]: https://discord.gg/bYd5A2Q
[yaml.js]: https://github.com/jeremyfa/yaml.js/blob/develop/dist/yaml.js
[tokenize.js]: https://gist.github.com/BonsaiDen/1810887
[micro-requirejs]: https://github.com/dsheiko/micro-requirejs
[Deep Clone]: https://github.com/mbrowne/simpleoo.js/blob/master/simpleoo.js
[Get Font Awesome Icon from MIME]: https://gist.github.com/colemanw/9c9a12aae16a4bfe2678de86b661d922#gistcomment-2632557
[Debounce decorator]: https://medium.freecodecamp.org/here-are-a-few-function-decorators-you-can-write-from-scratch-488549fe8f86
[CSS hasStyleRule]: https://stackoverflow.com/a/46589334
[Coroutine]: https://github.com/antivanov/coroutine.js
[MD5 (Message-Digest Algorithm)]: http://www.webtoolkit.info/