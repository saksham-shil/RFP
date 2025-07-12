import PageLayout from '../../../Layout/PageLayout/index'
import api from '../../../services/api'
import { useEffect, useState } from 'react'
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import toast from 'react-hot-toast';
import PAGINATIONCONFIG from '../../../constants/PAGINATIONCONFIG';
import { useNavigate } from 'react-router-dom';

const Categories = () => {
    const crumbLinks = [
        { name: 'Home', link: '/admin' },
        { name: 'Categories' }
    ]
    const [categories, setCategories] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [curPage, setCurPage] = useState(0);
    const [updateLoading, setUpdateLoading] = useState(null);

    const itemsPerPage = PAGINATIONCONFIG.itemsPerPage;
    const start = curPage * itemsPerPage;
    const curCategories = categories?.slice(start, start + itemsPerPage);
    const pageCount = Math.ceil (categories.length/itemsPerPage);

    const navigate = useNavigate();
    const handlePageClick = (selectedPage) => {
        setCurPage(selectedPage.selected)
    }

    const fetchCategories = async (signal) => {
        try {
            
            const res = await api.get('/api/categories', { signal });
            console.log(res)
            
            if (res.data.response === 'success') {
                setCategories(Object.values(res.data.categories))
            }
            else toast.error(res.data.error)
        } catch (e) {
            if (!axios.isCancel(e)) {
                console.error("Failed to fetch categories:", e);
                toast.error("Failed to fetch categories, please refresh.");
            }
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const controller = new AbortController()
        fetchCategories(controller.signal);

        return () => {
            controller.abort();
        };
    }, [])

    const updateCategory = async(category, cur_status) => {
        const new_status = cur_status === 'Active' ? 0 : 1
        const category_id = category.id
        setUpdateLoading(category_id);
        try {
            const res = await api.post(`/api/categories/${category_id}`, {
                'name' : category.name, 'status' : new_status, '_method' : 'put'});

            if (res.data.response === 'success') {
                toast.success(`Category updated successfully`)
                setCategories(curCategories => (
                    curCategories.map(cur => (cur.id === category_id 
                        ? {...cur, status : cur_status === 'Active' ? 'Inactive' : 'Active'}
                        : cur
                    ))
                ))
            }
            else toast.error(res.data.error)
        }
        catch (e) {
            if (!axios.isCancel(e)) {
                console.error("Failed to update category:", e);
                toast.error("Failed to update category, please try again");
            }
        } finally {setUpdateLoading(null);}
    }
    const deleteCategory = async(category_id) => {
        setUpdateLoading(category_id);
        try {
            const res = await api.delete(`/api/categories/delete/${category_id}`);

            if (res.data.response === 'success') {
                toast.success(`Category deleted successfully`)
                setCategories(curCategories => (
                    curCategories.filter(cur => cur.id !== category_id)
                ))
            }
            else toast.error(res.data.error)
        }
        catch (e) {
            if (!axios.isCancel(e)) {
                console.error("Failed to delete category:", e);
                toast.error("Failed to delete category, please try again");
            }
        } finally {setUpdateLoading(null);}
    }


    return (
        <PageLayout title='Category List' crumbs={crumbLinks}>
            <div className="row">
                <div className="col-lg-12">
                    <div className="card">
                        <div className="card-body">
                            <div className="TableHeader">
                                <div className="row justify-content-between align-items-center">
                                    <div className="col-auto">
                                        <h4 className="card-title">Categories</h4>
                                    </div>
                                    <div className="col-auto"> <button onClick={()=>(navigate('/admin/categories/create'))}className='btn btn-primary btn-sm'> Create new Category </button> </div>
                                </div>
                            </div>
                            <div className="table-responsive">
                                <table className="table mb-0 listingData dt-responsive" id="datatable">
                                    <thead>
                                        <tr>
                                            <th>S. No.</th>
                                            <th>Category Name</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {isLoading && <tr><td colSpan={4} className="text-center"><strong> Loading Data</strong> </td></tr> }
                                        {!isLoading && curCategories.length === 0 && <tr><td colSpan={4} className="text-center"><strong> No data found. Try to Refresh. </strong> </td></tr>}
                                        {curCategories?.map((row, index) => (
                                            <tr key={index}>
                                                <td>{(curPage * itemsPerPage) + (index+1)}</td>
                                                <td>{row.name}</td>
                                                <td>
                                                    <span className={`badge badge-pill ${
                                                        row.status.toLowerCase() === 'active' ? 'badge-success' : 'badge-danger'
                                                    }`}>
                                                        {row.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    {updateLoading === row.id && <i className="mdi mdi-loading mdi-spin text-primary"></i>}

                                                    {updateLoading !== row.id && (
                                                        <>
                                                        {/* Activate */}
                                                        {row.status.toLowerCase() === 'active' && (
                                                            <button className="btn btn-link text-danger p-0" onClick={() => updateCategory(row, row.status)}>
                                                            <i className="mdi mdi-circle-off-outline"></i>
                                                            </button>
                                                        )}
                                                            {/* Deactiv */}
                                                        {row.status.toLowerCase() === 'inactive' && (
                                                            <button className="btn btn-link text-success p-0" onClick={() => updateCategory(row, row.status)}>
                                                            <i className="mdi mdi-check"></i>
                                                            </button>
                                                        )}
                                                        {/* del */}
                                                        <button className="btn btn-link text-danger mx-2 p-0" onClick={() => deleteCategory(row.id)}>
                                                            <i className="mdi mdi-delete-forever-outline"></i>
                                                        </button>
                                                        </>
                                                    )}
                                                    </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <ReactPaginate
                                previousLabel={"previous"}
                                nextLabel={"next"}
                                breakLabel={"..."}
                                pageCount={pageCount}
                                marginPagesDisplayed={PAGINATIONCONFIG.marginPagesDisplayed}
                                pageRangeDisplayed={PAGINATIONCONFIG.pageRangeDisplayed}
                                onPageChange={handlePageClick}
                                containerClassName={"pagination"}
                                pageClassName={"page-item"}
                                pageLinkClassName={"page-link"}
                                previousClassName={"page-item"}
                                previousLinkClassName={"page-link"}
                                nextClassName={"page-item"}
                                nextLinkClassName={"page-link"}
                                breakClassName={"page-item"}
                                breakLinkClassName={"page-link"}
                                activeClassName={"active"}
                            />
                        </div>
                    </div>
                </div>
            </div>

        </PageLayout>
    );
};

export default Categories;