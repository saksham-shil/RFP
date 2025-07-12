import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../services/api'

const ForgotPassword = () => {
    const navigate = useNavigate();
    const formik = useFormik({
        initialValues: {
            email: ''
        },
        validationSchema: Yup.object({
            email: Yup.string().email("Invalid email format").required("Email is required.")
        }),
        onSubmit: async (values, { setSubmitting }) => {
            setSubmitting(true);
            try {
                const res = await api.post('/api/forgetPassword', {
                    'email': values.email
                });

                if (res.data.error) {
                    toast.error(res.data.error[0] || 'Invalid credentials. Please try again.');
                } else {
                    toast.success('OTP sent to your email!');
                    navigate('/reset-password-otp', { state: { email: values.email } });
                }
            } catch (error) {
                toast.error("An error occurred. Please try again.");
                console.error("Forgot Password failed:", error);
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
                                                    <h5 className="text-primary">Forgot Password</h5>
                                                    <p>Enter your email to receive an OTP.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-body pt-0">
                                        <div className="p-2">
                                            <form className="form-horizontal" onSubmit={formik.handleSubmit}>
                                                <div className="form-group">
                                                    <label htmlFor="email">Email</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="email"
                                                        name="email"
                                                        onChange={formik.handleChange}
                                                        value={formik.values.email}
                                                        placeholder="Enter Email" />
                                                </div>
                                                {formik.touched.email && formik.errors.email && (
                                                    <p className="text-danger">{formik.errors.email}</p>

                                                )}
                                                <div className="mt-3">
                                                    <button className="btn btn-primary btn-block waves-effect waves-light" type="submit" disabled={formik.isSubmitting}>
                                                        {formik.isSubmitting ? 'Submitting...' : 'Submit'}
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

export default ForgotPassword;
