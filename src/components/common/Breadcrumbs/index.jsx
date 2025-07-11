import { Link } from "react-router-dom";

const Breadcrumb = ({title, crumbs}) => {
  return (
    <div className="row">
      <div className="col-12">
        <div className="page-title-box d-flex align-items-center justify-content-between">
          <h4 className="mb-0 font-size-18">{title}</h4>
          <div className="page-title-right">
            <ol className="breadcrumb m-0">
                {crumbs.map((item, index) => ( 
                    <li key={index} className="breadcrumb-item">
                        {item.link ? 
                            <Link to={item.link}>{item.name}</Link>
                            : <span>{item.name}</span>
                        }
                    </li>
                ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Breadcrumb;