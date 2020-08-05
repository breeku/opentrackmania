import React from 'react'

/* https://stackoverflow.com/questions/51607043/how-to-lazy-load-the-background-image-inside-the-inline-style-property-react */
export const useProgressiveImage = src => {
    const [sourceLoaded, setSourceLoaded] = React.useState(null)

    React.useEffect(() => {
        const img = new Image()
        img.src = src
        img.onload = () => setSourceLoaded(src)
    }, [src])

    return sourceLoaded
}
