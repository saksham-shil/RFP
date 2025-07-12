import Header from '../../components/common/Header';
import VendorSidebar from '../../components/common/VendorSidebar';
import Footer from '../../components/common/Footer'
import Breadcrumb from '../../components/common/Breadcrumbs';

const VendorPageLayout = ({ children, title, crumbs }) => {
  return (
    <div id="layout-wrapper">
      <Header />
      <VendorSidebar />
      <div className="main-content">
        <div className="page-content">
          <div className="container-fluid">
              <Breadcrumb title={title} crumbs={crumbs}/>
            {children}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default VendorPageLayout;