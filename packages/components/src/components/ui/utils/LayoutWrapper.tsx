import { motion } from 'framer-motion'

interface LayoutWrapperProps {
  children: React.ReactNode
  className?: string
  animateOnExit?: boolean
  layout?: boolean | 'position' | 'size' | 'preserve-aspect'
  duration?: number
  delay?: number
  layoutId?: string
}

const LayoutWrapper: React.FC<LayoutWrapperProps> = ({
  children,
  className,
  animateOnExit = true,
  layout = 'position',
  duration = 0.2,
  delay = 0,
  layoutId,
}) => (
  <motion.div
    layoutId={layoutId}
    layout={layout}
    initial={{ opacity: 0 }}
    animate={{
      opacity: 1,
      transition: {
        duration: duration,
        delay: delay,
      },
    }}
    exit={animateOnExit ? { opacity: 0 } : undefined}
    className={className}
  >
    {children}
  </motion.div>
)

export default LayoutWrapper
