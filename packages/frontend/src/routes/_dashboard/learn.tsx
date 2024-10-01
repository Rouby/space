import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard/learn')({
  component: () => <div>Hello /_dashboard/learn!</div>,
})
