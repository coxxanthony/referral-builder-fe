"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AddReferralDialog,
  ReferralFormValues,
} from "@/components/referrals/add-referral-dialog";
import { api } from "@/utils/axios";
import { Pen, Trash } from "lucide-react";

export type Referral = ReferralFormValues & {
  id: number;
  created_at: string;
  updated_at: string;
};

export default function Home() {
  const queryClient = useQueryClient();

  const {
    data: referrals,
    isLoading,
    isError,
    error,
  } = useQuery<Referral[], Error>({
    queryKey: ["referrals"],
    queryFn: async () => {
      const response = await api.get<{ data: Referral[] }>("/referrals");
      return response.data.data;
    },
  });

  const addMutation = useMutation<Referral, Error, ReferralFormValues>({
    mutationFn: async (values: ReferralFormValues) => {
      const payload = {
        ...values,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      const { data } = await api.post<Referral>("/referrals", payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["referrals"] });
    },
  });

  return (
    <Card className="w-3/4 mx-auto mt-10">
      <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold">Referrals</h2>
        <AddReferralDialog onSubmit={(values) => addMutation.mutate(values)} />
      </CardHeader>

      <CardContent>
        <div className="w-full overflow-x-auto">
          {isLoading ? (
            <div className="p-4">Loading referrals...</div>
          ) : isError ? (
            <div className="p-4 text-red-500">{error.message}</div>
          ) : referrals?.length === 0 ? (
            <div className="p-4">No referrals found.</div>
          ) : (
            <Table className="min-w-150 sm:min-w-0">
              <TableHeader>
                <TableRow>
                  <TableHead className="uppercase text-sm text-semibold">
                    Given Name
                  </TableHead>
                  <TableHead className="uppercase text-sm text-semibold">
                    Surname
                  </TableHead>
                  <TableHead className="uppercase text-sm text-semibold">
                    Email
                  </TableHead>
                  <TableHead className="uppercase text-sm text-semibold">
                    Phone
                  </TableHead>
                  <TableHead className="uppercase text-sm text-semibold">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {referrals?.map((referral: Referral) => (
                  <TableRow key={referral.id}>
                    <TableCell>{referral.given_name}</TableCell>
                    <TableCell>{referral.surname}</TableCell>
                    <TableCell>{referral.email}</TableCell>
                    <TableCell>{referral.phone}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Pen
                          size={16}
                          fill="#A8A8A8"
                          color="#A8A8A8"
                          className="cursor-pointer text-muted-foreground"
                        />
                        <Trash
                          size={16}
                          fill="#A8A8A8"
                          color="#A8A8A8"
                          className="cursor-pointer text-muted-foreground"
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
