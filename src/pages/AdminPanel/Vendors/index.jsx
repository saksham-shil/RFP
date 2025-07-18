import PageLayout from '../../../Layout/PageLayout/index'
import api from '../../../services/api'
import { useEffect, useState } from 'react'
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import toast from 'react-hot-toast';
import PAGINATIONCONFIG from '../../../constants/PAGINATIONCONFIG';

const Vendors = () => {
    const crumbLinks = [
        { name: 'Home', link: '/admin' },
        { name: 'Vendors' }
    ]
    const [vendors, setVendors] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [isError, setError] = useState(false);
    const [curPage, setCurPage] = useState(0);
    const [updateLoading, setUpdateLoading] = useState(null);

    const itemsPerPage = PAGINATIONCONFIG.itemsPerPage;
    const start = curPage * itemsPerPage;
    const curVendors = vendors?.slice(start, start + itemsPerPage);
    const pageCount = Math.ceil (vendors.length/itemsPerPage);

    const handlePageClick = (selectedPage) => {
        setCurPage(selectedPage.selected)
    }

    const fetchVendors = async (signal) => {
        try {
            
            const res = await api.get('/api/vendorlist', { signal });
            console.log(res);

            if (res.data.response === 'success') {
                setVendors(res.data.vendors)
            }
            else toast.error(res.data.errors)
        } catch (e) {
            setError(true);
            if (!axios.isCancel(e)) {
                console.error("Failed to fetch vendors:", e);
                toast.error("Failed to fetch vendors, please refresh.");
            }
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const controller = new AbortController()
        fetchVendors(controller.signal);

        return () => {
            controller.abort();
        };
    }, [])

    const updateVendor = async(vendor_id, update) => {
        setUpdateLoading(vendor_id);
        //reject -> 2, approve -> 1
        const status = update === 2 ? 'rejected' : 'approved';
        try {
            const res = await api.post('/api/approveVendor', {
                user_id : vendor_id,
                status : status
            });

            if (res.data.response === 'success') {
                toast.success(`Vendor ${status} successfully`)
                setVendors(curVendors => (
                    curVendors.map(cur => cur.user_id === vendor_id 
                        ? {...cur, status : status.charAt(0).toUpperCase() + status.slice(1)} 
                        : cur
                    )
                ))
            }
            else toast.error(res.data.error)
        }
        catch (e) {
            if (!axios.isCancel(e)) {
                console.error("Failed to update vendor:", e);
                toast.error("Failed to update vendor, please try again");
            }
        } finally {setUpdateLoading(null);}
    }
  console.log(curVendors)

    return (
        <PageLayout title='Vendors List' crumbs={crumbLinks}>
            <div className="row">
                <div className="col-lg-12">
                    <div className="card">
                        <div className="card-body">
                            <div className="TableHeader">
                                <div className="row">
                                    <div className="col-lg-3">
                                        <h4 className="card-title">Vendors</h4>
                                    </div>
                                </div>
                            </div>
                            <div className="table-responsive">
                                <table className="table mb-0 listingData dt-responsive" id="datatable">
                                    <thead>
                                        <tr>
                                            <th>S. No.</th>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Contact No</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {isLoading && <tr><td colSpan={6} className="text-center"><strong> Loading Data</strong> </td></tr> }
                                        {/* {isError && <tr><td colSpan={3} className="text-center"><strong> Error Occured while Loading Data </strong> </td></tr>} */}
                                        {!isLoading && curVendors.length === 0 && <tr><td colSpan={6} className="text-center"><strong> No data found. Try to Refresh. </strong> </td></tr>}
                                        {curVendors?.map((row, index) => (
                                            <tr key={index}>
                                                <th scope="row">{(curPage * itemsPerPage) + index + 1}</th>
                                                <td>{row.name}</td>
                                                <td>{row.email}</td>
                                                <td>{row.mobile}</td>
                                                <td>
                                                    <span className={`badge badge-pill ${
                                                        row.status.toLowerCase() === 'approved' ? 'badge-success' :
                                                        row.status.toLowerCase() === 'pending' ? 'badge-warning' :
                                                        row.status.toLowerCase() === 'rejected' ? 'badge-danger' :
                                                        'badge-secondary'
                                                    }`}>
                                                        {row.status}
                                                    </span>
                                                </td>
                                                {row.status.toLowerCase()==='pending' && row.user_id === updateLoading && 
                                                <td><i className="mdi mdi-loading mdi-spin text-primary"></i> </td>}

                                                {row.status.toLowerCase()==='pending' && row.user_id !== updateLoading && 
                                                <td>
                                                    <button className="btn btn-link text-success p-0" onClick={() => updateVendor(row.user_id, 1)}><i className="mdi mdi-check"></i></button>
                                                    <button className="btn btn-link text-danger p-0" onClick={()=> updateVendor(row.user_id, 2)}><i className="mdi mdi-circle-off-outline"></i></button>
                                                </td>}
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

export default Vendors;