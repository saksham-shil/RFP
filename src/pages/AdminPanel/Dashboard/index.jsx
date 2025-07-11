import PageLayout from '../../../Layout/PageLayout/index'

const Dashboard = () => {
  const crumbLinks = [
    {name:'Home'}
  ]
  return (
    <PageLayout title = 'Dashboard' crumbs = {crumbLinks}>

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
    </PageLayout>
  );
};

export default Dashboard;