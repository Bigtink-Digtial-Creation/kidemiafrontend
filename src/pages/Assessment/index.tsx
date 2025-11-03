import { BreadcrumbItem, Breadcrumbs, Button, Chip, Spinner } from '@heroui/react'
import { SidebarRoutes } from '../../routes'
import { PiExamBold } from 'react-icons/pi'
import { MdOutlineDashboard } from 'react-icons/md'
import { useQuery } from '@tanstack/react-query'
import { QueryKeys } from '../../utils/queryKeys'
import { ApiSDK } from '../../sdk'
import AssessmentCard from '../../components/Cards/AssessmentCard'

export default function AssessmentPage() {

  const { data: assessmentData, isLoading } = useQuery({
    queryKey: [QueryKeys.allAssessment],
    queryFn: () => ApiSDK.AssessmentsService.getAssessmentsApiV1AssessmentsGet(),
  })

  const assessment = assessmentData?.items || []

  console.log({ assessmentData });

  if (isLoading || !assessmentData) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Spinner size="lg" color="warning" />
      </div>
    );
  }

  return (
    <div className='space-y-8'>
      <div className='flex justify-between items-center'>
        <Breadcrumbs variant="light" color="foreground">
          <BreadcrumbItem
            href={SidebarRoutes.dashboard}
            startContent={<MdOutlineDashboard />}
          >
            Dashboard
          </BreadcrumbItem>
          <BreadcrumbItem
            href={SidebarRoutes.takeAssessment}
            startContent={<PiExamBold />}
            color="warning"
          >
            Assessment
          </BreadcrumbItem>
        </Breadcrumbs>

        <div className='flex justify-between items-center space-x-6'>
          <Chip variant='flat' color="primary" className='text-sm font-semibold whitespace-nowrap'>
            Unit balance : 100
          </Chip>

          <Button
            className="bg-kidemia-secondary text-kidemia-white font-medium w-full px-8"
            size="md"
            radius="sm"
            type="button"
          >
            Buy Unit
          </Button>
        </div>
      </div>

      <div className='space-y-3'>

        <div>
          <p className='text-kidemia-grey text-lg'>Explore Past Questions</p>
        </div>


        <div className='py-4'>
          {assessment?.length === 0 ? (
            <div>
              <p className='text-center text-kidemia-grey italic'>No Available Assessment</p>
            </div>
          ) : (
              <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
              {assessment.map((asst) => (
                <AssessmentCard
                  key={asst.id}
                  title={asst.title}
                  code={asst.code}
                  timeMins={asst.duration_minutes}
                  questionsNo={asst.total_questions}
                  attemptsNo={asst.total_attempts}
                  priceNo={asst.price}
                  avgScore={asst.average_score} />
              ))}
            </div>
          )}

        </div>


      </div>
    </div>
  )
}
