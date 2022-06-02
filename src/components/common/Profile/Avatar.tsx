 import * as React from "react"
 import { StaticImage } from "gatsby-plugin-image"
 

 const Avatar: React.FC<{}> = () => {
   return (
       <StaticImage
         className="bio-avatar"
         layout="fixed"
         formats={["auto", "webp", "avif"]}
         src="https://avatars.githubusercontent.com/u/41544175?s=400&u=2dc22b573556acc44541e092c8fee0e7b7800c0c&v=4"
         width={50}
         height={50}
         quality={95}
         alt="Profile picture"
       />
   )
 }
 
 export default Avatar
 