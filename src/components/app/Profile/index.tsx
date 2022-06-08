import * as React from "react"
import { graphql, useStaticQuery } from "gatsby"
import styled from "styled-components"

import Avatar from "@src/components/UI/Avatar"
import SocialGroup from "@src/components/UI/group/SocialGroup"

const ProfileCard = styled.div({
  display: "flex",
  padding: 10,
})

const ProfileContents = styled.div({
  paddingLeft: 10,
  fontSize: 13,
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
      imageSharp(fixed: { originalName: { eq: "profile.png" } }) {
        gatsbyImageData(
          layout: FIXED
          backgroundColor: ""
          formats: NO_CHANGE
          height: 50
          width: 50
          quality: 95
          placeholder: DOMINANT_COLOR
        )
      }
    }
  `)

  // Set these values by editing "siteMetadata" in gatsby-config.js
  const author = data.site.siteMetadata?.author
  const social = data.site.siteMetadata?.social
  const profileImage = data.imageSharp?.gatsbyImageData

  const contents = author?.name && (
    <>
      <span>
        <strong>{author.name}</strong> | {author?.job ?? null} <br />
        {author?.summary ?? null}
      </span>
      <SocialGroup social={social} />
    </>
  )

  return (
    <ProfileCard>
      <Avatar image={profileImage} />
      <ProfileContents>{contents}</ProfileContents>
    </ProfileCard>
  )
}

export default Profile
