import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <div className="pt-[400px]">
      <h3 className='text-red'>Welcome Home!</h3>
    </div>
  )
}
