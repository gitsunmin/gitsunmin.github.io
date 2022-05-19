import * as React from "react"
import { graphql, useStaticQuery } from "gatsby"
import styled from "styled-components"

import Avatar from "./Avatar"
import GithubIcon from "@src/components/icons/GithubIcon"

const ProfileCard = styled.div({
  display: "flex",
  padding: 10,
})

const ProfileContents = styled.div({
  padding: 10,
})

const Profile: React.FC<{}> = () => {
  const data = useStaticQuery(graphql`
    query BioQuery {
      site {
        siteMetadata {
          author {
            name
            job
            summary
          }
          social {
            github
          }
        }
      }
    }
  `)

  // Set these values by editing "siteMetadata" in gatsby-config.js
  const author = data.site.siteMetadata?.author
  const social = data.site.siteMetadata?.social

  const contents = author?.name && (
    <>
      <span>
        <strong>{author.name}</strong> | {author?.job ?? null} <br />
        {author?.summary ?? null}
      </span>
      <div>
        <GithubIcon
          onClick={() => {
            window.open(social.github, "_blank")
          }}
        />
      </div>
    </>
  )

  return (
    <ProfileCard>
      <Avatar />
      <ProfileContents>{contents}</ProfileContents>
    </ProfileCard>
  )
}

export default Profile
