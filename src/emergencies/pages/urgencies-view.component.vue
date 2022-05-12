<script setup>
import Toolbar from "primevue/toolbar";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import ConfirmDialog from "primevue/confirmdialog";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import InputNumber from "primevue/inputnumber";
import { PrimeIcons, FilterMatchMode } from "primevue/api";
import { useConfirm } from "primevue/useconfirm";
import { onMounted, ref } from "vue";
import { UrgenciesServices } from "../services/urgencies.services";
import { useRouter } from "vue-router";
import { useGuardianStore } from "@/stores/guardian";

const service = new UrgenciesServices();
const store = useGuardianStore();
const router = useRouter();
const confirm = useConfirm();

const dt = ref();
const data = ref([]);
const selection = ref([]);

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const modalVisible = ref(false);
const currentUrgency = ref({});

const handleFetch = async () => {
  if (!store.$state["id"]) {
    router.push("/home");
  }

  const id = Number(store.$state["id"]);
  const res = await service.getByGuardianId(id);
  data.value = res.data;
};

onMounted(handleFetch);

const handleEdit = item => {
  modalVisible.value = true;
  currentUrgency.value = item;
};

const handleNew = () => handleEdit({});

const handleExport = () => {
  dt.value.exportCSV();
};

const handleCancel = () => {
  modalVisible.value = false;
  currentUrgency.value = {};
};

const handleSave = async () => {
  if (!currentUrgency.value.title) return;
  if (!currentUrgency.value.latitude) return;
  if (!currentUrgency.value.longitude) return;

  const isUpdate = !!currentUrgency.value.id;
  const guardianId = Number(store.$state["id"]);
  const date = new Date();

  currentUrgency.value.guardianId = guardianId;
  if (!isUpdate) {
    currentUrgency.value.reportedAt = date.toISOString();
  }

  if (isUpdate) {
    await service.update(currentUrgency.value.id, currentUrgency.value);
  } else {
    await service.create(currentUrgency.value);
  }

  handleCancel();
  handleFetch();
};

const handleDelete = items => {
  confirm.require({
    header: "Confirmation",
    message: `Are you sure you want to delete ${items.length} item${
      items.length === 1 ? "" : "s"
    }?`,
    icon: PrimeIcons.EXCLAMATION_TRIANGLE,
    accept: async () => {
      await Promise.all(items.map(item => service.delete(item.id)));
      handleFetch();
    },
  });
};

const getPrintableDate = str => {
  const date = new Date(str);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
};
</script>

<template>
  <Toolbar class="p-0 mb-1 flex items-center">
    <template #start>
      <h2>Manage Urgencies</h2>
    </template>

    <template #end>
      <span class="p-float-label">
        <InputText
          id="urgency_searchbar"
          v-model="filters.global.value"
          type="text" />
        <label for="urgency_searchbar">Search</label>
      </span>
    </template>
  </Toolbar>
  <Toolbar class="p-0 mb-1">
    <template #start>
      <div class="space-x-1">
        <Button label="New" :icon="PrimeIcons.PLUS" @click="handleNew" />
        <Button
          label="Delete"
          :icon="PrimeIcons.TRASH"
          class="p-button-danger"
          @click="handleDelete(selection)" />
      </div>
    </template>

    <template #end>
      <Button
        label="Export"
        :icon="PrimeIcons.DOWNLOAD"
        class="p-button-info"
        @click="handleExport" />
    </template>
  </Toolbar>
  <DataTable
    ref="dt"
    v-model:selection="selection"
    :value="data"
    data-key="id"
    :filters="filters"
    :paginator="true"
    paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
    :rows="10"
    :rows-per-page-options="[5, 10, 15]"
    current-page-report-template="Showing {first} to {last} of {totalRecords} urgencies"
    responsive-layout="scroll">
    <Column selection-mode="multiple" :exportable="false" />
    <Column field="id" header="ID" :sortable="true" />
    <Column field="title" header="Title" :sortable="true" />
    <Column field="summary" header="Summary" :sortable="true" />
    <Column field="latitude" header="Latitude" :sortable="true" />
    <Column field="longitude" header="Longitude" :sortable="true" />
    <Column field="reportedAt" header="Reported At" :sortable="true">
      <template #body="props">
        {{ getPrintableDate(props.data["reportedAt"]) }}
      </template>
    </Column>
    <Column :exportable="false">
      <template #body="props">
        <Button
          :icon="PrimeIcons.PENCIL"
          class="p-button-rounded p-button-text"
          @click="handleEdit(props.data)" />
        <Button
          :icon="PrimeIcons.TRASH"
          class="p-button-rounded p-button-text p-button-danger"
          @click="handleDelete([props.data])" />
      </template>
    </Column>
  </DataTable>
  <Dialog
    v-model:visible="modalVisible"
    :header="!currentUrgency.id ? 'Create Urgency' : 'Edit Urgency'"
    :modal="true"
    class="w-1/2">
    <div class="flex flex-col space-y-1">
      <span class="p-float-label">
        <InputText
          id="urgency-form_title"
          v-model="currentUrgency.title"
          class="w-full"
          :required="true"
          type="text" />
        <label for="urgency-form_title">Title</label>
      </span>
      <span class="p-float-label">
        <Textarea
          id="urgency-form_summary"
          v-model="currentUrgency.summary"
          class="w-full"
          rows="3" />
        <label for="urgency-form_summary">Summary</label>
      </span>
      <span class="p-float-label">
        <InputNumber
          id="urgency-form_latitude"
          v-model="currentUrgency.latitude"
          class="w-full"
          mode="decimal"
          :max-fraction-digits="10" />
        <label for="urgency-form_latitude">Latitude</label>
      </span>
      <span class="p-float-label">
        <InputNumber
          id="urgency-form_longitude"
          v-model="currentUrgency.longitude"
          class="w-full"
          mode="decimal"
          :max-fraction-digits="10" />
        <label for="urgency-form_longitude">Longitude</label>
      </span>
    </div>

    <template #footer>
      <div class="space-x-1">
        <Button label="Save" @click="handleSave" />
        <Button label="Cancel" class="p-button-danger" @click="handleCancel" />
      </div>
    </template>
  </Dialog>
  <ConfirmDialog />
</template>
