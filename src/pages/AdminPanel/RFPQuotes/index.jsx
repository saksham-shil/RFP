import PageLayout from '../../../Layout/PageLayout/index'
import api from '../../../services/api'
import { useEffect, useState } from 'react'
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import toast from 'react-hot-toast';
import PAGINATIONCONFIG from '../../../constants/PAGINATIONCONFIG';
import { useParams } from 'react-router-dom';

const RFPQuotes = () => {
    const {rfp_id} = useParams();

    const crumbLinks = [
        { name: 'Home', link: '/admin' },
        { name: 'RFP Quotes' }
    ]

    const [quotes, setQuotes] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [curPage, setCurPage] = useState(0);
    const [noQuotes, setNoQuotes] = useState(false);

    const itemsPerPage = PAGINATIONCONFIG.itemsPerPage;
    const start = curPage * itemsPerPage;
    const curQuotes = quotes?.slice(start, start + itemsPerPage);
    const pageCount = Math.ceil (quotes.length/itemsPerPage);

    const handlePageClick = (selectedPage) => {
        setCurPage(selectedPage.selected)
    }

    const fetchQuotes = async (signal) => {
        try {
            
            const res = await api.get(`/api/rfp/quotes/${rfp_id}`, { signal });
            console.log(res)
            
            if (res.data.response === 'success') {
                setQuotes(res.data.quotes)
            }
            else if (res.data.error === 'No quotes available') {
                setNoQuotes(true);
                toast.error(res.data.error);
            }
            else toast.error(res.data.error);
        } catch (e) {
            if (!axios.isCancel(e)) {
                console.error("Failed to fetch quotes:", e);
                toast.error("Failed to fetch quotes, please refresh.");
            }
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const controller = new AbortController()
        fetchQuotes(controller.signal);

        return () => {
            controller.abort();
        };
    }, [])


    return (
        <PageLayout title={`RFP ${rfp_id} Quotes`} crumbs={crumbLinks}>
            <div className="row">
                <div className="col-lg-12">
                    <div className="card">
                        <div className="card-body">
                            <div className="TableHeader">
                                <div className="row justify-content-between align-items-center">
                                    <div className="col-auto">
                                        <h4 className="card-title">Quotes</h4>
                                    </div>
                                </div>
                            </div>
                            <div className="table-responsive">
                                <table className="table mb-0 listingData dt-responsive" id="datatable">
                                    <thead>
                                        <tr>
                                            <th>Vendor ID.</th>
                                            <th>Vendor Name</th>
                                            <th>Item Price</th>
                                            <th>Total Cost</th>
                                            <th>Vendor Mobile No.</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {isLoading && <tr><td colSpan={5} className="text-center"><strong> Loading Data</strong> </td></tr> }
                                        {!isLoading && !noQuotes && curQuotes.length === 0 && <tr><td colSpan={5} className="text-center"><strong> Couldn't fetch data. Try to Refresh. </strong> </td></tr>}
                                        {!isLoading && noQuotes && <tr><td colSpan={5} className="text-center"><strong> No bids are made yet for this RFP. </strong> </td></tr>}
                                        {curQuotes?.map((row, index) => (
                                            <tr key={index}>
                                                <td>{row.vendor_id}</td>
                                                <td>{row.name}</td>
                                                <td>{row.item_price}</td>
                                                <td>{row.total_cost}</td>
                                                <td>{row.mobile}</td>
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

export default RFPQuotes;