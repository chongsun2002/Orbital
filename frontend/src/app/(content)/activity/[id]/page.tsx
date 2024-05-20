export default function Page({ params }: { params : { id: string } }) {
    return <div>You are viewing Activity { params.id }</div>
}