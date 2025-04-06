import UserForm from './view'
interface ProductPageProps {
    params: Promise<{ slug: string }>
}


export default async function page({ params }: ProductPageProps) {
    const slug = await params
    return (
        <div>
            <UserForm params={slug} />
        </div>
    )
}
