import { AlertCircle, Calendar, Shield, User } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { supabase } from "@/utils/supabase/client";
import { getUser } from "@/utils/supabase/server";
import AppealDialog from "@/dialog/AppealDialog";

export default async function ViewOffenses() {
  const user = await getUser();

  if (!user?.user_metadata?.full_name) {
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
      .or(
        `offenderName.eq.${user?.user_metadata?.full_name},sentBy.eq.${user?.user_metadata?.full_name}`
      );

    if (offensesError) {
      return "Unable to fetch offense records. Please try again later.";
    }

    return (
      <div className="container mx-auto py-6 px-4">
        <Card className="mx-auto w-full">
          <CardHeader className="space-y-1">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-2xl">Student Record</CardTitle>
            </div>
            <CardDescription className="text-lg font-medium">
              {user?.user_metadata?.full_name}
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
                          <div className="flex items-center space-x-2">
                            <Shield className="h-4 w-4 text-red-500" />
                            <span className="font-semibold">
                              {offense.typeOfIncident}
                            </span>
                          </div>
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-sti-yellow">
                            {offense.caseTracking}
                          </span>
                        </div>

                        {offense.sentBy === user?.user_metadata?.full_name && (
                          <>
                            <p className="text-sm text-green-600 font-bold">
                              You submitted a report.
                            </p>
                            <p className="text-sm text-muted-foreground">
                              You reported: {offense.offenderName}
                            </p>
                          </>
                        )}

                        {offense.offenderName ===
                          user?.user_metadata?.full_name && (
                          <>
                            <p className="text-sm text-red-600 font-bold">
                              You have been reported.
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Reported by: {offense.sentBy}
                            </p>

                            {offense.caseTracking === "Case Decision" && (
                              <div className="flex justify-end">
                                <AppealDialog caseId={offense.id} />
                              </div>
                            )}
                          </>
                        )}

                        {offense.typeOfIncident && (
                          <p className="text-sm text-muted-foreground">
                            Incident Type: {offense.typeOfIncident}
                          </p>
                        )}

                        {offense.incidentDescription && (
                          <p className="text-sm text-muted-foreground">
                            Description: {offense.incidentDescription}
                          </p>
                        )}

                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
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

                        {/* Disciplinary Action Section */}
                        <div className="mt-4">
                          <p className="text-sm font-semibold break-words overflow-wrap break-word">
                            Disciplinary Action:
                          </p>
                          <p className="text-sm break-words overflow-wrap break-word mt-2">
                            {offense.offenseType}
                          </p>
                          <p className="text-sm break-words overflow-wrap break-word mt-2">
                            {offense.caseSanction}
                          </p>
                          <p className="text-sm break-words overflow-wrap break-word mt-2">
                            {offense.majorCategory}
                          </p>
                          <p className="text-sm break-words overflow-wrap break-word mt-2">
                            {offense.specificOffense}
                          </p>
                          <p className="text-sm break-words overflow-wrap break-word mt-2">
                            {offense.offenseCategory}
                          </p>
                        </div>

                        <p className="text-sm font-semibold break-words overflow-wrap break-word mt-4">
                          Case documentation:
                        </p>
                        <p className="text-sm break-words overflow-wrap break-word mt-2">
                          {offense.caseReport}
                        </p>
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
