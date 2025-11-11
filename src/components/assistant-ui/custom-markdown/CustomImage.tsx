'use client'

import React, { useState, useEffect } from 'react'
import { getImageSrc } from '@/lib/integration/client/image'

function CustomImage(props: React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>) {
  // if the src no (protocol):// then we will manipulate it to hit the backend 
  const initialSrc = typeof props.src === 'string' ? props.src : ''
  const [FinalSRC, setFinalSRC] = useState<string>(initialSrc)
  const [isLoading, setLoading] = useState<boolean>(false)
  console.log(initialSrc)

  useEffect(() => {
    let createdObjectUrl: string | null = null
    const srcVal = props.src

    setLoading(true)

    if (typeof srcVal === 'string' && srcVal.length > 0) {
      // Check if src has a protocol (e.g., http://, https://, data:, etc.)
      const hasProtocol = /^[a-z]+:\/\//.test(srcVal) || srcVal.startsWith('data:')
      
      if (!hasProtocol) {
        // No protocol means we need to get the final image src using getImageSrc
        getImageSrc(srcVal)
          .then((imageSrc) => {
            setFinalSRC(imageSrc)
            setLoading(false)
          })
          .catch((error) => {
            console.error('Failed to fetch image:', error)
            setFinalSRC('')
            setLoading(false)
          })
      } else {
        // Has protocol, use src as-is
        setFinalSRC(srcVal)
        setLoading(false)
      }
    } else if (srcVal instanceof Blob) {
      // create an object URL for Blob/Files
      createdObjectUrl = URL.createObjectURL(srcVal)
      setFinalSRC(createdObjectUrl)
      setLoading(false)
    } else {
      setFinalSRC('')
      setLoading(false)
    }

    return () => {
      if (createdObjectUrl) {
        URL.revokeObjectURL(createdObjectUrl)
      }
    }
  }, [props.src])

  if (isLoading && !FinalSRC) {
  return <></>
  }

  return (
    <img
      {...props}
      src={FinalSRC}
      alt={props.alt ?? ''}
      onLoad={() => setLoading(false)}
      onError={() => setLoading(false)}
    />
  )
}

export default CustomImage