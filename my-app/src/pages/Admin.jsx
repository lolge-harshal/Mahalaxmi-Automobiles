import { useState } from 'react'
import AdminLayout from '../admin/AdminLayout'
import AdminProducts from '../admin/sections/AdminProducts'
import AdminServices from '../admin/sections/AdminServices'
import AdminEnquiries from '../admin/sections/AdminEnquiries'
import AdminContent from '../admin/sections/AdminContent'

const SECTIONS = {
    products: <AdminProducts />,
    services: <AdminServices />,
    enquiries: <AdminEnquiries />,
    content: <AdminContent />,
}

export default function Admin() {
    const [section, setSection] = useState('products')

    return (
        <AdminLayout activeSection={section} onSectionChange={setSection}>
            {SECTIONS[section]}
        </AdminLayout>
    )
}
