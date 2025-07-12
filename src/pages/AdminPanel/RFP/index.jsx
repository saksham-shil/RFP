import PageLayout from '../../../Layout/PageLayout/index'
import api from '../../../services/api'
import { useEffect, useState } from 'react'
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import toast from 'react-hot-toast';
import PAGINATIONCONFIG from '../../../constants/PAGINATIONCONFIG';
import { useNavigate } from 'react-router-dom';

const RFP = () => {
    const crumbLinks = [
        { name: 'Home', link: '/admin' },
        { name: 'RFPs' }
    ]
    const navigate = useNavigate();
    const [rfp, setRfp] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [isError, setError] = useState(false);
    const [curPage, setCurPage] = useState(0);
    const [updateLoading, setUpdateLoading] = useState(null);

    const itemsPerPage = PAGINATIONCONFIG.itemsPerPage;
    const start = curPage * itemsPerPage;
    const curRfps = rfp?.slice(start, start + itemsPerPage);
    const pageCount = Math.ceil (rfp.length/itemsPerPage);

    const handlePageClick = (selectedPage) => {
        setCurPage(selectedPage.selected)
    }


    const fetchRfp = async (signal) => {
        try {
            
            const res = await api.get('/api/rfp/all', { signal });
            console.log(res)
            
            if (res.data.response === 'success') {
                setRfp(res.data.rfps)
            }
            else toast.error(res.data.errors)
        } catch (e) {
            setError(true);
            if (!axios.isCancel(e)) {
                console.error("Failed to fetch rfps:", e);
                toast.error("Failed to fetch rfps, please refresh.");
            }
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const controller = new AbortController()
        fetchRfp(controller.signal);

        return () => {
            controller.abort();
        };
    }, [])

    const updateVendor = async(rfp_id) => {
        setUpdateLoading(rfp_id);
        try {
            const res = await api.get(`/api/rfp/closerfp/${rfp_id}`);

            if (res.data.response === 'success') {
                toast.success(`RFP closed successfully`)
                setRfp(curRfps => (
                    curRfps.map(cur => (cur.rfp_id === rfp_id 
                        ? {...cur, status : 'closed'}
                        : cur
                    ))
                ))
            }
            else toast.error(res.data.error)
        }
        catch (e) {
            if (!axios.isCancel(e)) {
                console.error("Failed to close rfp:", e);
                toast.error("Failed to close rfp, please try again");
            }
        } finally {setUpdateLoading(null);}
    }


    return (
        <PageLayout title='RFP List' crumbs={crumbLinks}>
            <div className="row">
                <div className="col-lg-12">
                    <div className="card">
                        <div className="card-body">
                            <div className="TableHeader">
                                <div className="row justify-content-between align-items-center">
                                    <div className="col-auto">
                                        <h4 className="card-title">RFPs</h4>
                                    </div>
                                    <div className="col-auto"> <button onClick = {()=>(navigate('/admin/rfp/create'))} className='btn btn-primary btn-sm'> Create a RFP </button> </div>
                                </div>
                            </div>
                            <div className="table-responsive">
                                <table className="table mb-0 listingData dt-responsive" id="datatable">
                                    <thead>
                                        <tr>
                                            <th>RFP No.</th>
                                            <th>Item Title</th>
                                            <th>Last Date</th>
                                            <th>Min Amount</th>
                                            <th>Max Amount</th>
                                            <th>Status</th>
                                            <th>Close</th>
                                            <th>Quotes</th>
                                        </tr>
                                    </thead>
                                     <tbody>
                                        {isLoading && <tr><td colSpan={7} className="text-center"><strong> Loading Data</strong> </td></tr> }
                                        {/* {isError && <tr><td colSpan={3} className="text-center"><strong> Error Occured while Loading Data </strong> </td></tr>} */}
                                        {!isLoading && curRfps.length === 0 && <tr><td colSpan={7} className="text-center"><strong> No data found. Try to Refresh. </strong> </td></tr>}
                                        {curRfps?.map((row, index) => (
                                            <tr key={index}>
                                                <td>{row.rfp_no}</td>
                                                <td>{row.item_name}</td>
                                                <td>{row.last_date}</td>
                                                <td>{row.minimum_price}</td>
                                                <td>{row.maximum_price}</td>
                                                <td>
                                                    <span className={`badge badge-pill ${
                                                        row.status.toLowerCase() === 'open' ? 'badge-success' : 'badge-danger'
                                                    }`}>
                                                        {row.status}
                                                    </span>
                                                </td>
                                                <td>
                                                {row.status.toLowerCase()==='open' && row.rfp_id === updateLoading && 
                                                <i className="mdi mdi-loading mdi-spin text-primary"></i> }

                                                {row.status.toLowerCase()==='open' && row.rfp_id !== updateLoading && 
                                            
                                                    <button className="btn btn-link text-danger p-0" onClick={()=> updateVendor(row.rfp_id)}><i className="mdi mdi-circle-off-outline"></i></button>
                                                }
                                                </td>
                                                <td> 
                                                    {row.status.toLowerCase()==='open' && row.rfp_id !== updateLoading && 
                                                    <button className="btn btn-link p-0" onClick={()=>(navigate(`/admin/rfp/quotes/${row.rfp_id}`))}><i className="mdi mdi-eye-circle-outline"></i></button>}
                                                </td>
                                            </tr>

                                        ))}
                                    </tbody>                                </table>
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

export default RFP;