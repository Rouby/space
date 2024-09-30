import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard/games')({
  component: () => <div>Hello /_dashboard/games!</div>,
})
