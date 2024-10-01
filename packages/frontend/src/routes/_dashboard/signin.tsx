import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard/signin')({
  component: () => <div>Hello /_dashboard/signin!</div>,
})
