import { PageLayout, PageHeader, Section, EmptyState } from '@/components/layout'
import { Button, Input, Card, CardHeader, CardContent, CardFooter } from '@/components/ui'

export default function Home() {
  return (
    <PageLayout>
      <PageHeader
        title="UI Primitives Showcase"
        description="Standardized components: Button, Input, Card"
      />

      <div className="space-y-8">
        {/* Buttons Section */}
        <Section title="Buttons">
          <div className="flex flex-wrap gap-4 items-center">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="primary" disabled>Disabled</Button>
            <Button variant="primary" loading>Loading</Button>
            
            <div className="w-full border-t border-muted my-4 opacity-20" />
            
            <Button size="sm" variant="primary">Small</Button>
            <Button size="md" variant="primary">Medium</Button>
            <Button size="lg" variant="primary">Large</Button>
          </div>
        </Section>

        {/* Inputs Section */}
        <Section title="Inputs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
            <Input 
              label="Username" 
              placeholder="Enter your username" 
              hint="This will be displayed on your public profile."
            />
            <Input 
              label="Email" 
              type="email" 
              placeholder="name@example.com" 
            />
            <Input 
              label="Password" 
              type="password" 
              error="Password must be at least 8 characters"
            />
            <Input 
              label="Disabled" 
              disabled 
              placeholder="Cannot type here"
            />
          </div>
        </Section>

        {/* Cards Section */}
        <Section title="Cards">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Simple Card</h3>
              </CardHeader>
              <CardContent>
                <p className="text-muted">This is a basic card with header and content.</p>
              </CardContent>
              <CardFooter>
                <Button size="sm" variant="outline">Action</Button>
              </CardFooter>
            </Card>

            <Card className="border border-primary/20">
              <CardHeader>
                <h3 className="text-lg font-semibold text-primary">Highlighted Card</h3>
              </CardHeader>
              <CardContent>
                <p className="text-text">This card uses utility classes for extra styling while maintaining structure.</p>
              </CardContent>
            </Card>

             <Card>
              <CardContent className="pt-6">
                <p className="mb-4">Card without header, just content.</p>
                <div className="flex gap-2">
                   <Button variant="primary" className="w-full">Confirm</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </Section>

        <Section title="Empty State">
           <EmptyState
            message="No data found"
            description="Example of the empty state component"
          />
        </Section>
      </div>
    </PageLayout>
  )
}
