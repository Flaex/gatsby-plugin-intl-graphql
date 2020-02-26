import React from "react"
import { Link, useIntl } from "gatsby-plugin-intl-graphql"

import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"

const IndexPage = () => {
  const intl = useIntl().messages
  return (
    <Layout>
      <SEO
        lang={intl.locale} 
        title={intl.static.seo.title} 
      />
      <h1>{intl.static.main_title}</h1>
      <p>{intl.static.welcome}</p>
      <p>{intl.static.description}</p>
      <Link to="/articles/">{intl.static.post}</Link>
      <div style={{ maxWidth: `300px`, marginBottom: `1.45rem` }}>
        <Image />
      </div>
      <Link to="/page-2/">
        {intl.static.go_to}
      </Link>
    </Layout>
  )
}

export default IndexPage
