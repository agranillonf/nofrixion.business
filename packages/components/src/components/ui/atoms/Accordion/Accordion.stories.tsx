import { Meta, StoryFn } from '@storybook/react'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './Accordion'

export default {
  title: 'Atoms/Accordion',
  component: Accordion,
} as Meta<typeof Accordion>

const Template: StoryFn<{
  subText?: string
}> = ({ ...args }) => {
  return (
    <Accordion type="single" collapsible {...args}>
      <AccordionItem value="item-1">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export const Showcase = Template.bind({})
Showcase.args = {}
