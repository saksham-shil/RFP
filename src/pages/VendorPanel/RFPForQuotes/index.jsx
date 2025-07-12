import VendorPageLayout from '../../../Layout/VendorPageLayout/index'
import api from '../../../services/api'
import { useEffect, useState } from 'react'
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import toast from 'react-hot-toast';
import PAGINATIONCONFIG from '../../../constants/PAGINATIONCONFIG';
import { useNavigate } from 'react-router-dom';

const RFPForQuotes = () => {
    const crumbLinks = [
        { name: 'Home', link: '/vendor' },
        { name: 'RFP For Quotes' }
    ]
    const navigate = useNavigate();
    const [rfp, setRfp] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [curPage, setCurPage] = useState(0);
    const [noRfp, setNorfp] = useState(false);

    const itemsPerPage = PAGINATIONCONFIG.itemsPerPage;
    const start = curPage * itemsPerPage;
    const curRfps = rfp?.slice(start, start + itemsPerPage);
    const pageCount = Math.ceil (rfp.length/itemsPerPage);

    const handlePageClick = (selectedPage) => {
        setCurPage(selectedPage.selected)
    }


    const fetchRfp = async (signal) => {
        try {
            const user_id = localStorage.getItem('userid')
            const res = await api.get(`/api/rfp/getrfp/${user_id}`, { signal });
            console.log(res)
            
            if (res.data.response === 'success') {
                setRfp(res.data.rfps)
            }
            else if (res.data.error === 'no rfps found') {
                setNorfp(true);
                toast.error(res.data.error)
            }
            else toast.error(res.data.error)
        } catch (e) {
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


    return (
        <VendorPageLayout title='RFP List' crumbs={crumbLinks}>
            <div className="row">
                <div className="col-lg-12">
                    <div className="card">
                        <div className="card-body">
                            <div className="TableHeader">
                                <div className="row justify-content-between align-items-center">
                                    <div className="col-auto">
                                        <h4 className="card-title">RFPs</h4>
                                    </div>
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
                                            <th>Application Status</th>
                                            <th>Apply</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {isLoading && <tr><td colSpan={8} className="text-center"><strong> Loading Data</strong> </td></tr> }
                                        {noRfp && <tr><td colSpan={8} className="text-center"><strong> No RFPs are there for you </strong> </td></tr>}
                                        {!isLoading && !noRfp && curRfps.length === 0 && <tr><td colSpan={8} className="text-center"><strong> No data found. Try to Refresh. </strong> </td></tr>}
                                        {curRfps?.map((row, index) => (
                                            <tr key={index}>
                                                <td>{row.rfp_no}</td>
                                                <td>{row.item_name}</td>
                                                <td>{row.last_date}</td>
                                                <td>{row.minimum_price}</td>
                                                <td>{row.maximum_price}</td>
                                                <td>
                                                    <span className={`badge badge-pill ${
                                                        row.rfp_status.toLowerCase() === 'open' ? 'badge-success' : 'badge-danger'
                                                    }`}>
                                                        {row.rfp_status}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className={`badge badge-pill ${
                                                        row.applied_status.toLowerCase() === 'open' ? 'badge-success' : 'badge-danger'
                                                    }`}>
                                                        {row.applied_status}
                                                    </span>
                                                </td>
                                                <td>
                                                {row.rfp_status.toLowerCase()==='open' && row.applied_status.toLowerCase() ==='open' && 
                                                    <button className="btn btn-link  p-0" onClick={()=>(navigate(`/vendor/rfp-for-quote/quote/${row.rfp_id}`))}><i className="mdi mdi-send-check"></i></button>}
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

        </VendorPageLayout>
    );
};

export default RFPForQuotes;