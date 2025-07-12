import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../services/api'

const ResetPasswordOTP = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    const formik = useFormik({
        initialValues: {
            otp: '',
            new_password: ''
        },
        validationSchema: Yup.object({
            otp: Yup.string().required("OTP is required."),
            new_password: Yup.string().min(5, 'Password must be at least 5 characters').required("New Password is required.")
        }),
        onSubmit: async (values, { setSubmitting }) => {
            setSubmitting(true);
            try {
                const res = await api.post('/api/confirmotpresetPassword', {
                    email: email,
                    otp: values.otp,
                    new_password: values.new_password
                });

                if (res.data.error) {
                    toast.error(res.data.error[0] || 'An error occurred. Please try again.');
                } else {
                    toast.success('Password has been reset successfully!');
                    navigate('/login');
                }
            } catch (error) {
                toast.error("An error occurred. Please try again.");
                console.error("Reset Password failed:", error);
            } finally {
                setSubmitting(false);
            }
        }
    });

    return (
        <>
            <div>
                <div className="home-btn d-none d-sm-block">
                    <a href="index.html" className="text-dark"><i className="fas fa-home h2"></i></a>
                </div>
                <div className="account-pages my-5 pt-sm-5">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-md-8 col-lg-6 col-xl-5">
                                <div className="card overflow-hidden">
                                    <div className="bg-soft-primary">
                                        <div className="row">
                                            <div className="col-12">
                                                <div className="text-primary p-4">
                                                    <h5 className="text-primary">Reset Password</h5>
                                                    <p>Enter the OTP and your new password.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-body pt-0">
                                        <div className="p-2">
                                            <form className="form-horizontal" onSubmit={formik.handleSubmit}>
                                                <div className="form-group">
                                                    <label htmlFor="otp">OTP</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="otp"
                                                        name="otp"
                                                        onChange={formik.handleChange}
                                                        value={formik.values.otp}
                                                        placeholder="Enter OTP" />
                                                </div>
                                                {formik.touched.otp && formik.errors.otp && (
                                                    <p className="text-danger">{formik.errors.otp}</p>
                                                )}

                                                <div className="form-group">
                                                    <label htmlFor="new_password">New Password</label>
                                                    <input
                                                        type="password"
                                                        className="form-control"
                                                        id="new_password"
                                                        name="new_password"
                                                        onChange={formik.handleChange}
                                                        value={formik.values.new_password}
                                                        placeholder="Enter New Password" />
                                                </div>
                                                {formik.touched.new_password && formik.errors.new_password && (
                                                    <p className="text-danger">{formik.errors.new_password}</p>
                                                )}

                                                <div className="mt-3">
                                                    <button className="btn btn-primary btn-block waves-effect waves-light" type="submit" disabled={formik.isSubmitting}>
                                                        {formik.isSubmitting ? 'Submitting...' : 'Reset Password'}
                                                    </button>
                                                </div>
                                                <div className="mt-4 text-center">
                                                    <Link to='/login'>Back to Login</Link>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-5 text-center">
                                    <div>
                                        <p>&copy; Copyright <i className="mdi mdi-heart text-danger"></i> RFP System</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ResetPasswordOTP;
