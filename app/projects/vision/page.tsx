import ProjectLayout from 'app/components/project-layout';
import { Container } from 'app/components/container';
import { VisionDemo } from 'app/components/projects/vision/vision-demo';
import { ProjectDescription } from 'app/components/projects/project-description';
import { ApplicationCard } from 'app/components/projects/vision/application-card';

const applications = [
  {
    title: "Industrial Quality Inspection",
    description: "Advanced object detection system tailored for production lines to identify defects, missing components, and abnormalities in real time. This system reduces the need for manual inspection, ensuring consistent product quality throughout the manufacturing process.",
    skills: ["Edge computing", "IoT", "Object detection", "Azure IoT Edge", "Kubernetes", "Real-time data processing"],
    value: "Early detection of quality issues enables high standards, minimizes downtime, and lowers costs, streamlining inspection workflows for maximum efficiency."
  },
  {
    title: "Retail Loss Prevention and Shopper Insights",
    description: "Object detection system for monitoring shopper behavior, reducing loss, and capturing data on customer interactions. This solution provides insights into shopper habits while helping to minimize shrinkage.",
    skills: ["Object detection", "Real-time analytics", "REST APIs", "Google Cloud Vision AI", "Vertex AI"],
    value: "Enhances loss prevention and operational efficiency, empowering data-driven decisions on store layout, inventory management, and customer engagement to increase profitability."
  },
  {
    title: "Medical Image Analysis",
    description: "Object detection model for medical imaging to identify anomalies such as tumors or fractures, supporting radiologists with fast, accurate diagnostics. This system integrates seamlessly into existing workflows, allowing for real-time image analysis.",
    skills: ["Medical imaging", "AWS HealthLake", "SageMaker", "TensorFlow", "Secure data pipelines"],
    value: "Automation of medical image analysis reduces diagnostic workloads and improves patient care through early anomaly detection and streamlined processes."
  },
  {
    title: "Geological Analysis for Mineral and Rock Detection",
    description: "Advanced object detection models tailored to geological datasets to identify minerals and rock formations, supporting resource exploration and environmental studies by efficiently processing vast geological data.",
    skills: ["Geological data processing", "3D modeling", "Azure Databricks", "Azure Machine Learning", "Object detection"],
    value: "Automated geological analysis enables faster, data-driven exploration decisions, reduces manual surveying costs, and enhances resource assessment accuracy."
  }
];

export const metadata = {
  title: 'Computer Vision Projects',
  description: 'Showcasing computer vision and object detection',
}

export default function VisionPage() {
  return (
    <Container>
      <ProjectLayout
        demo={<VisionDemo />}
      >
        <div className="space-y-8">
          <div>
            <h1 className="font-semibold text-2xl mb-8 tracking-tighter">
              Computer Vision Projects
            </h1>
            <ProjectDescription
              paragraphs={[
                "Interactive demonstration of real-time object detection. Use the controls to adjust the number and variety of falling images, and toggle the background image to see how the detection system adapts to different scenarios.",
                "This demo showcases my capabilities using modern computer vision systems, particularly in real-time object detection and tracking. The technology can be adapted for various industrial and commercial applications, from quality control to security systems."
              ]}
            />
          </div>

          <div>
            <h2 className="font-semibold text-xl mb-4 tracking-tighter">
              What I Can Build For You
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-2">
              {applications.map((app, index) => (
                <ApplicationCard key={index} {...app} />
              ))}
            </div>
          </div>
        </div>
      </ProjectLayout>
    </Container>
  );
} 