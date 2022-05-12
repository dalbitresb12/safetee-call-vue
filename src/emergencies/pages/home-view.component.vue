<script setup>
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import { GuardiansService } from "../services/guardians.service";
import { onMounted, ref } from "vue";
import { useGuardianStore } from "@/stores/guardian";

const service = new GuardiansService();
const store = useGuardianStore();

const data = ref([]);

onMounted(async () => {
  const res = await service.getAll();
  data.value = res.data;
});

const setGuardian = item => {
  store.$state = item;
};

/**
 * @param {string} str
 */
const getPrintableGender = str => {
  return `${str.at(0).toLocaleUpperCase()}${str.substring(1)}`;
};
</script>

<template>
  <DataTable
    :value="data"
    data-key="id"
    :paginator="true"
    paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
    :rows="10"
    :rows-per-page-options="[5, 10, 15]"
    current-page-report-template="Showing {first} to {last} of {totalRecords} guardians"
    responsive-layout="scroll">
    <Column field="id" header="ID" :sortable="true" />
    <Column field="username" header="Username" :sortable="true" />
    <Column field="firstName" header="First Name" :sortable="true" />
    <Column field="lastName" header="Last Name" :sortable="true" />
    <Column field="gender" header="Gender" :sortable="true">
      <template #body="props">
        {{ getPrintableGender(props.data["gender"]) }}
      </template>
    </Column>
    <Column field="address" header="Address" :sortable="true" />
    <Column :exportable="false">
      <template #body="props">
        <Button
          label="Set Current"
          class="p-button-text"
          @click="setGuardian(props.data)" />
      </template>
    </Column>
  </DataTable>
</template>
