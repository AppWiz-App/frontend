import { Dispatch, SetStateAction, useRef } from 'react';
import { RiCheckLine } from '@remixicon/react';
import { appendStyle } from '../utils/appendStyle';

type Step = {
  label: string;
};

type Props = {
  steps: Step[];
  activeStep: number;
  setActiveStep: Dispatch<SetStateAction<number>>;
};

export function CycleFormTabs({ steps, activeStep, setActiveStep }: Props) {
  const highestStep = useRef(0);
  if (activeStep > highestStep.current) {
    highestStep.current = activeStep;
  }

  return (
    <div className={`h-16 w-full grid [grid-template-columns:1fr_1fr_1fr]`}>
      {steps.map((step, index) => (
        <button
          key={Symbol.for(step.label).toString()}
          className={getButtonClassName(index, activeStep)}
          disabled={index > highestStep.current}
          onClick={() => setActiveStep(index)}
        >
          <StepIndex index={index} activeIndex={activeStep} /> {step.label}
        </button>
      ))}
    </div>
  );
}

type StepIndexProps = {
  index: number;
  activeIndex: number;
};

function StepIndex({ index, activeIndex }: StepIndexProps) {
  return (
    <div className={getStepIndexClassName(index, activeIndex)}>
      {activeIndex > index ? <RiCheckLine /> : index + 1}
    </div>
  );
}

function getStepIndexClassName(index: number, activeIndex: number) {
  const base = 'flex justify-center items-center w-8 h-8 text-white rounded-sm';

  if (index < activeIndex) {
    return base + appendStyle('bg-emerald-500');
  }

  if (index === activeIndex) {
    return base + appendStyle('bg-sky-600');
  }

  if (index > activeIndex) {
    return base + appendStyle('bg-slate-400');
  }
}

function getButtonClassName(index: number, activeIndex: number) {
  const base =
    'flex flex-row justify-center items-center gap-4 h-full bg-slate-100 font-bold transition-all';

  if (index < activeIndex) {
    return base + appendStyle('text-emerald-500');
  }

  if (index === activeIndex) {
    return (
      base + appendStyle('border-b-4 border-sky-600 bg-white text-sky-600')
    );
  }

  if (index > activeIndex) {
    return base + appendStyle('text-slate-400');
  }
}
