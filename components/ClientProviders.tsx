'use client'

import dynamic from 'next/dynamic'

const CustomCursor = dynamic(() => import('@/components/CustomCursor'), { ssr: false })
const ParticleBackground = dynamic(() => import('@/components/ParticleBackground'), { ssr: false })
const ChatWidget = dynamic(() => import('@/components/ChatWidget'), { ssr: false })

export default function ClientProviders() {
  return (
    <>
      <CustomCursor />
      <ParticleBackground />
      <ChatWidget />
    </>
  )
}
