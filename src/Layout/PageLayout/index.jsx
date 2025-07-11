import Header from '../../components/common/Header';
import Sidebar from '../../components/common/Sidebar';
import Footer from '../../components/common/Footer'
import Breadcrumb from '../../components/common/Breadcrumbs';

const PageLayout = ({ children, title, crumbs }) => {
  return (
    <div id="layout-wrapper">
      <Header />
      <Sidebar />
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

export default PageLayout;