import ProjectLayout from 'app/components/project-layout';
import { Container } from 'app/components/container';

export const metadata = {
  title: 'Predictive Models',
  description: 'Showcasing predictive modeling and monitoring',
}

export default function PredictionPage() {
  return (
    <Container>
      <ProjectLayout
        demo={
          <div className="h-full flex items-center justify-center">
            {/* Demo component will go here */}
            <p className="text-neutral-600">Interactive Prediction Demo</p>
          </div>
        }
      >
        <h1 className="font-semibold text-2xl mb-8 tracking-tighter">
          Predictive Models
        </h1>
        <p>
          Description of your predictive modeling work, including testing,
          evaluation, and monitoring systems.
        </p>
      </ProjectLayout>
    </Container>
  );
} 