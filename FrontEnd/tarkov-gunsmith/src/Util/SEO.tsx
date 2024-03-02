import React from 'react';
import { Helmet } from 'react-helmet-async';

export interface SEOprops {
    url:string,
    title: string, 
    description?: string, 
}

export function SEO(props: SEOprops) {
    const {url, title} = props;
    const defaultDescription = "Check ammo and armor effectiveness in shots to kill, get a computer to make a leveled weapon metabuild for you. Surely you'll be a chad now!";
    const description = props.description ? props.description : defaultDescription;
    return (
        <Helmet>
            { /* Standard metadata tags */}
            <title>{title}</title>
            <meta name='description' content={description} />
            { /* End standard metadata tags */}
            { /* Open Graph / Facebook tags */}
            <meta property="og:type" content={"website"} />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            { /* End Open Graph / Facebook tags */}
            { /* Twitter tags */}
            <meta name="twitter:creator" content={"@TarkovGunsmith"} />
            <meta name="twitter:url" content={url} />
            <meta name="twitter:card" content={"summary_large_image"} />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            { /* End Twitter tags */}

            <link rel="apple-touch-icon" href="%PUBLIC_URL%/TG_icon.png" />
        </Helmet>
    )
}