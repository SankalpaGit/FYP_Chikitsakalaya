import PatientLayout from "../../layouts/PatientLayout";
import AboutUs from "../../components/abouts/AboutUs"
import ContactUI from "../../components//abouts/ContactUI";

const About = () => {

    // this will be used as the about us page  

    return (
        <PatientLayout>
            < AboutUs />
            <section id="pricing" className="py-16 px-4 sm:px-6 lg:px-8 ">
                <div className="max-w-6xl mx-auto text-center">
                    <p className="mt-2 text-lg text-gray-700 max-w-xl mx-auto">
                        We integrate with <span className="font-bold text-purple-600">Stripe</span> to provide secure, easy, and free payments.
                        Book appointments and consult with doctors without any worries.
                    </p>
                </div>
            </section>
            < ContactUI />
        </PatientLayout>
    );
};

export default About;
