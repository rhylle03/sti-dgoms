import { cookies } from "next/headers";
import {
  AlertCircle,
  Calendar,
  MessageSquareWarning,
  Shield,
  SquareCheckBig,
  User,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { supabase } from "@/utils/supabase/client";
import { getUser } from "@/utils/supabase/server";

export default async function ViewOffenses() {
  const user = await getUser();
  if (!user) {
    return (
      <Card className="mx-auto w-full">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Access Denied</CardTitle>
          <CardDescription>Please log in to view your records</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  try {
    const { data: offenses, error: offensesError } = await supabase
      .from("sti_dgoms_case")
      .select("*")
      .eq("sentBy", user?.user_metadata?.full_name);

    if (offensesError) {
      return (
        <Card className="mx-auto w-full">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Error</CardTitle>
            <CardDescription>
              Unable to fetch offense records. Please try again later.
            </CardDescription>
          </CardHeader>
        </Card>
      );
    }

    return (
      <div className="container mx-auto py-6 px-4">
        <Card className="mx-auto w-full">
          <CardHeader className="space-y-1">
            <div className="flex items-center space-x-2">
              <SquareCheckBig className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-2xl">Case Status</CardTitle>
            </div>
            <CardDescription className="text-lg font-medium">
              Submitted reports
            </CardDescription>
          </CardHeader>
          <CardContent>
            {offenses && offenses.length > 0 ? (
              <div className="space-y-4">
                {offenses.map((offense) => (
                  <Card key={offense.id} className="overflow-hidden">
                    <div className="border-l-4 border-sti-blue">
                      <CardContent className="grid gap-4 p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col space-y-1">
                            <span className="mb-2">{offense.offenderName}</span>
                            <div className="flex items-center space-x-2">
                              <Shield className="h-4 w-4 text-red-500" />
                              <span className="font-semibold">
                                {offense.typeOfIncident}
                              </span>
                            </div>
                          </div>
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-sti-yellow">
                            {offense.caseTracking}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <MessageSquareWarning className="h-4 w-4" />
                          <time dateTime={offense.created_at}>
                            {new Date(offense.created_at).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </time>
                        </div>
                        {offense.incidentDescription && (
                          <p className="text-sm text-muted-foreground">
                            {offense.incidentDescription}
                          </p>
                        )}
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2 rounded-lg border border-dashed p-8">
                <AlertCircle className="h-5 w-5 text-muted-foreground" />
                <p className="text-muted-foreground">
                  No offense records found.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  } catch (error) {
    return (
      <Card className="mx-auto w-full">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Error</CardTitle>
          <CardDescription>
            An unexpected error occurred. Please try again later.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }
}
