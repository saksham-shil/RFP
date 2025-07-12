import PageLayout from '../../../Layout/PageLayout/index'
import CreateRFPPage1 from './CreateRFPPage1';
import CreateRFPPage2 from './CreateRFPPage2';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../../services/api';

const CreateRFP = () => {
    const crumbLinks = [
        { name: 'Home', link: '/admin' },
        { name: 'RFPs', link:'/admin/rfp-lists' },
        { name: 'Create'}
    ]

    const [step, setStep] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    
    const handleBack = () => {
        setStep(1);
    }
    const handleNext = (category) => {
        setSelectedCategory(category);
        setStep(2);
    }

    const handleSubmit = async (data) => {
        setIsSubmitting(true);
        const user_id = localStorage.getItem('userid')

        const payload = {
            user_id: user_id.id,
            rfp_no: data.rfp_no,
            item_name: data.itemName,
            item_description: data.itemDescription,
            quantity: data.quantity,
            last_date: data.lastDate,
            minimum_price: data.minPrice,
            maximum_price: data.maxPrice,
            categories: selectedCategory.value,
            vendors: data.selectedVendors.map(v => v.value).join(','),
        };

        try {
            const res = await api.post('/api/createrfp', payload);
            console.log(res);
            if (res.data.response === 'success') {
                toast.success('RFP created successfully!');
                navigate('/admin/rfp-lists');
            } else {
                toast.error(res.data.error[0] || 'Failed to create RFP.');
            }
        } catch (error) {
            toast.error('An error occurred while creating the RFP.');
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <PageLayout title={`Create New RFP`} crumbs={crumbLinks}>
            <div className="row">
                <div className="col-lg-12">
                    <div className="card">
                        <div className="card-body">
                            <div className="TableHeader">
                                <div className="row justify-content-between align-items-center">
                                    <div className="col-auto">
                                        <h4 className="card-title">Step {step} of 2</h4>
                                    </div>
                                </div>
                            </div>

                            {step === 1 ? (
                                <CreateRFPPage1
                                    onNext={handleNext}
                                    initialSelectedCategory={selectedCategory}
                                />
                            ) : (
                                <CreateRFPPage2
                                    onBack={handleBack}
                                    onSubmit={handleSubmit}
                                    selectedCategory={selectedCategory}
                                    isSubmitting={isSubmitting}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
};

export default CreateRFP;