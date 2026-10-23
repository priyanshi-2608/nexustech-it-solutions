import React from 'react';
import { Lightbulb, Handshake, Zap, ShieldCheck } from 'lucide-react';
import useScrollAnimation from '../hooks/useScrollAnimation';
import styles from '../styles/About.module.css';

const coreValues = [
    {
        id: 1,
        icon: <Lightbulb className={styles.lucideIcon} />,
        title: 'Innovation First',
        description: 'We constantly push boundaries, integrating modern cloud architecture and smart AI solutions into enterprise tech.'
    },
    {
        id: 2,
        icon: <Handshake className={styles.lucideIcon} />,
        title: 'Client Partnership',
        description: 'Your growth is our metric of success. We build long-term relationships centered around transparency and reliability.'
    },
    {
        id: 3,
        icon: <Zap className={styles.lucideIcon} />,
        title: 'High Performance',
        description: 'We engineer robust, optimized applications designed for zero downtime and blazing-fast user experiences.'
    },
    {
        id: 4,
        icon: <ShieldCheck className={styles.lucideIcon} />,
        title: 'Uncompromised Security',
        description: 'Security is woven into our development lifecycle from day one, safeguarding your critical enterprise data.'
    }
];

const About = () => {
    useScrollAnimation();

    return (
        <div className={styles.aboutPage}>
            {/* Hero Section */}
            <section className={styles.aboutHero}>
                <img
                    src="/Tech-image1.jpg"
                    alt="About NexusTech Hero"
                    className={styles.heroBackgroundImage}
                />
                <div className={styles.heroOverlay}></div>
                <div className={`container ${styles.heroContainer}`}>
                    <span className={styles.badge}>About NexusTech</span>
                    <h1>Empowering Enterprises Through Digital Excellence</h1>
                    <p>
                        We are a team of visionary engineers, designers, and strategists dedicated
                        to transforming complex business challenges into scalable, high-performance software realities.
                    </p>
                </div>
            </section>

            {/* Our Story / Mission Section */}
            <section className={`animate-on-scroll ${styles.storySection}`}>
                <div className="container">
                    <div className={styles.storyGrid}>
                        <div className={styles.storyContent}>
                            <span>Who We Are</span>
                            <h2>Pioneering the Next Generation of Enterprise IT Solutions</h2>
                            <p>
                                Founded with a passion for cutting-edge technology, NexusTech has evolved into a
                                trusted digital partner for fast-growing businesses and industry leaders worldwide.
                                We specialize in custom web development, mobile ecosystems, and intelligent AI integrations.
                            </p>
                            <p>
                                Our philosophy is simple: combine technical rigor with intuitive design to build products
                                that not only look phenomenal under the hood and on screen, but also drive measurable business growth.
                            </p>
                        </div>

                        {/* Image Container */}
                        <div className={styles.storyVisual}>
                            <img
                                src="/Tech-image2.jpg"
                                alt="NexusTech Team Collaboration"
                                className={styles.storyImage}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Values Section */}
            <section className={`animate-on-scroll ${styles.valuesSection}`}>
                <div className="container">
                    <div className={styles.sectionHeader}>
                        <span>Our Core Values</span>
                        <h2>What Drives Our Engineering Culture</h2>
                    </div>
                    <div className={styles.valuesGrid}>
                        {coreValues.map((val) => (
                            <div key={val.id} className={styles.valueCard}>
                                <div className={styles.iconWrapper}>
                                    {val.icon}
                                </div>
                                <h3>{val.title}</h3>
                                <p>{val.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;