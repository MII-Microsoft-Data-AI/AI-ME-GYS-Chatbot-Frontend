'use client'

import React, { useState, useEffect } from 'react'
import { getImageSrc } from '@/lib/integration/client/image'

function CustomImage(props: React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>) {
  const initialSrc = typeof props.src === 'string' ? props.src : ''
  const [FinalSRC, setFinalSRC] = useState<string>(initialSrc)
  const [, setLoading] = useState<boolean>(false)

  useEffect(() => {
    let createdObjectUrl: string | null = null
    let isCancelled = false
    const srcVal = props.src

    setLoading(true)

    if (typeof srcVal === 'string') {
      if (srcVal.startsWith('file://')) {
        // extract content after the scheme and fetch the image
        const content = srcVal.slice('file://'.length)
        getImageSrc(content)
          .then((imageSrc) => {
            if (!isCancelled) {
              setFinalSRC(imageSrc)
              setLoading(false)
            }
          })
          .catch((error) => {
            console.error('Failed to fetch image:', error)
            if (!isCancelled) {
              setFinalSRC('')
              setLoading(false)
            }
          })
      } else {
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
      isCancelled = true
      if (createdObjectUrl) {
        URL.revokeObjectURL(createdObjectUrl)
      }
    }
  }, [props.src])

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