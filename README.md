# gatsby-plugin-intl-graphql

Internationalize your Gatsby site dynamically.

## Features

- Turn your gatsby site into an internationalization-framework out of the box powered by [react-intl](https://github.com/yahoo/react-intl).

- Support automatic redirection based on the user's preferred language in browser provided by [browser-lang](https://github.com/wiziple/browser-lang).

- Support multi-language url routes in a single page component. This means you don't have to create separate pages such as `pages/en/index.js` or `pages/es/index.js`.

- Mine: Make your web page with dinamic data. Yes! you can to convert your dinamic data in static data. 

## Why?

When you build multilingual sites, Google recommends using different URLs for each language version of a page rather than using cookies or browser settings to adjust the content language on the page. [(read more)](https://support.google.com/webmasters/answer/182192?hl=en&ref_topic=2370587)

## Starters

Demo: [http://gatsby-starter-default-intl.netlify.com](http://gatsby-starter-default-intl.netlify.com)

Source: [https://github.com/wiziple/gatsby-plugin-intl/tree/master/examples/gatsby-starter-default-intl](https://github.com/wiziple/gatsby-plugin-intl/tree/master/examples/gatsby-starter-default-intl)

## Showcase

- [https://picpick.app](https://picpick.app)
- [https://www.krashna.nl](https://www.krashna.nl) [(Source)](https://github.com/krashnamusika/krashna-site)

_Feel free to send us PR to add your project._

## How to use

<!-- >**Note**: Para que este plugin pueda funcionar, se necesita de antemano instalar el plugin de graphql en el Backend (Strapi, see more [here](https://strapi.io/documentation/3.0.0-beta.x/plugins/graphql.html#usage)) -->

>**Note**: This plugin works with graphql layer, for this you need install the necessary backend plugin (Strapi, you can see more [here](https://strapi.io/documentation/3.0.0-beta.x/plugins/graphql.html#usage))

### Install package

`npm install --save gatsby-plugin-intl-graphql`

### Add a plugin to your gatsby-config.js

```javascript
// In your gatsby-config.js
plugins: [
  {
    resolve: `gatsby-plugin-intl-graphql`,
    options: {
      // required to make queries
      url: `http://localhost:1337/`
      // language JSON resource path
      path: `${__dirname}/src/lang`,
      // supported language
      languages: [`en`, `es`, `de`],
      // language file path
      defaultLanguage: `en`,
      // option to redirect to `/ko` when connecting `/`
      redirect: true,
      // needed query
      query: `{
        articles {
          id
          content_en {
            title
          }
          content_es {
            title
          }
        }
      }`
    },
  },
]
```

### Or you can make it of this way:
If you want to have an order (recommended), you can create a folder with all queries in string format:
```javascript
// queries/query.js
const query = `
{
  articles {
    id
    content_en {
      title
      description
    }
    content_es {
      title
      description
    }
  }
}`

// Export variable
module.exports = query;
```

Then you can to do this:

```javascript
// In your gatsby-config.js:
const query = require(`./queries/query`)

plugins: [
  {
    resolve: `gatsby-plugin-intl-graphql`,
    options: {
      // needed url to get dinamic data
      url: `http://localhost:1337/`
      // language JSON resource path
      path: `${__dirname}/src/lang`,
      // supported language
      languages: [`en`, `ko`, `de`],
      // language file path
      defaultLanguage: `ko`,
      // option to redirect to `/ko` when connecting `/`
      redirect: true,
      // needed query
      query, // ES6 feature
    },
  },
]
```

<!-- ### You'll also need to add language JSON resources to the project. -->
### You don't need add language JSON resource, because the plugin make that for you.

For example, if you have a next query:
```graphql
{
    articles {
        id
        content_en {
	    title
	    description
	}
	content_es {
	    title
	    description
	}
    }
}
```

Then, the plugin takes this query and saves the data in json, separating them in their respective files thanks to `languages` of the plugin configuration.

see the following sample:

| language resource file                                                                                                              | language |
| ----------------------------------------------------------------------------------------------------------------------------------- | -------- |
| [src/lang/en.json](https://github.com/wiziple/gatsby-plugin-intl/blob/master/examples/gatsby-starter-default-intl/src/intl/en.json) | English  |
| [src/lang/es.json](https://github.com/wiziple/gatsby-plugin-intl/blob/master/examples/gatsby-starter-default-intl/src/intl/ko.json) | Spanish   |

So, having the previous result, we can access the `messages` object, this object contains all the json data.

### Change your components

You can use `injectIntl` HOC on any react components including page components.

At intl you can make a destructuring of needed data.
> **Note:** The **messages** object contains the json data.

```jsx
import React from "react"
import { injectIntl } from "gatsby-plugin-intl"

const IndexPage = ({ intl: { messages } }) => {
  return (
    <Layout>
      <SEO title={messages.title} />
      <Link to="/page-2/">
        {messages.go_page2}
      </Link>
    </Layout>
  )
}
export default injectIntl(IndexPage)
```

Or you can use the new `useIntl` hook.


```jsx
import React from "react"
import { useIntl, Link } from "gatsby-plugin-intl"

const IndexPage = () => {
  const intl = useIntl()
  const { messages } = intl
  return (
    <Layout>
      <SEO title={messages.title} />
      <Link to="/page-2/">
        {messages.go_page2}
      </Link>
    </Layout>
  )
}
export default IndexPage
```

## How It Works

Let's say you have two pages (`index.js` and `page-2.js`) in your `pages` directory. The plugin will create static pages for every language.

| file                | English        | Spanish         | German         | Default\* |
| ------------------- | -------------- | -------------- | -------------- | --------- |
| src/pages/index.js  | /**en**        | /**es**        | /**de**        | /         |
| src/pages/page-2.js | /**en**/page-2 | /**es**/page-2 | /**de**/page-2 | /page-2   |

**Default Pages and Redirection**

If redirect option is `true`, `/` or `/page-2` will be redirected to the user's preferred language router. e.g) `/en` or `/en/page-2`. Otherwise, the pages will render `defaultLangugage` language. You can also specify additional component to be rendered on redirection page by adding `redirectComponent` option.

## Plugin Options

| Option            | Type              | Description                                                                                                                                                                                    |
| ----------------- | ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| url		    | string 		| Needed url to get data, example: `http://localhost:1337`
| path              | string            | language JSON resource path                                                                                                                                                                    |
| languages         | string[]          | supported language keys                                                                                                                                                                        |
| defaultLanguage   | string            | default language when visiting `/page` instead of `es/page`                                                                                                                                    |
| redirect          | boolean           | if the value is `true`, `/` or `/page-2` will be redirected to the user's preferred language router. e.g) `/es` or `/es/page-2`. Otherwise, the pages will render `defaultLangugage` language. |
| query		    | string		| It is necessary, to perform queries and return data and then transform and store them as JSON
| redirectComponent | string (optional) | additional component file path to be rendered on with a redirection component for SEO.                                                                                                         |

## Components

To make it easy to handle i18n with multi-language url routes, the plugin provides several components.

To use it, simply import it from `gatsby-plugin-intl`.

| Component           | Type      | Description                                                                                                                                                                  |
| ------------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Link                | component | This is a wrapper around @gatsby’s Link component that adds useful enhancements for multi-language routes. All props are passed through to @gatsby’s Link component.         |
| navigate            | function  | This is a wrapper around @gatsby’s navigate function that adds useful enhancements for multi-language routes. All options are passed through to @gatsby’s navigate function. |
| changeLocale        | function  | A function that replaces your locale. `changeLocale(locale, to = null)`                                                                                                      |
| IntlContextConsumer | component | A context component to get plugin configuration on the component level.                                                                                                      |
| injectIntl          | component | https://github.com/yahoo/react-intl/wiki/API#injection-api                                                                                                                   |                                                                                           |
| and more...         |           | https://github.com/yahoo/react-intl/wiki/Components                                                                                                                          |

## License

<!-- MIT &copy; [Daewoong Moon](https://github.com/wiziple) -->
MIT &copy; [David arenas](https://github.com/Davejs136)
