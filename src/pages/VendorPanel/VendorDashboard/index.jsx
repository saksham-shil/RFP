import VendorPageLayout from '../../../Layout/VendorPageLayout/index'

const VendorDashboard = () => {
  const crumbLinks = [
    {name:'Home'}
  ]
  return (
    <VendorPageLayout title = 'Dashboard' crumbs = {crumbLinks}>

      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-body">
              <div>
                Welcome to RFP System.
              </div>
            </div>
          </div>
        </div>
      </div>
    </VendorPageLayout>
  );
};

export default VendorDashboard;