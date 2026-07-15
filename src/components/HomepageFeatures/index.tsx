import type { ReactNode } from "react";
import clsx from "clsx";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";

interface Feature {
  title: string;
  emoji: string;
  description: string;
}

const features: Feature[] = [
  {
    title: "Structured Curriculum",
    emoji: "📚",
    description:
      "Follow a carefully designed learning path from cloud fundamentals to advanced architecture. Track your progress every step of the way.",
  },
  {
    title: "Hands-On Projects",
    emoji: "🛠️",
    description:
      "Build real-world cloud infrastructure projects. Apply what you learn with guided, production-quality exercises.",
  },
  {
    title: "Interactive Labs",
    emoji: "🧪",
    description:
      "Practice in safe, sandboxed environments. Experiment with cloud services without worrying about unexpected costs.",
  },
  {
    title: "Cloud Simulators",
    emoji: "⚡",
    description:
      "Visualize and interact with cloud architectures in real-time. Understand complex systems through simulation.",
  },
  {
    title: "Knowledge Graph",
    emoji: "🧠",
    description:
      "Explore how concepts connect. Our knowledge graph maps prerequisites, dependencies, and related topics.",
  },
  {
    title: "AI-Ready",
    emoji: "🤖",
    description:
      "Built for the future. All content includes structured metadata enabling AI-powered learning and recommendations.",
  },
];

function FeatureCard({ title, emoji, description }: Feature) {
  return (
    <div className={clsx("col col--4", styles.featureCard)}>
      <div className={styles.featureIcon}>{emoji}</div>
      <Heading as="h3" className={styles.featureTitle}>
        {title}
      </Heading>
      <p className={styles.featureDescription}>{description}</p>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {features.map((feature, idx) => (
            <FeatureCard key={idx} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
