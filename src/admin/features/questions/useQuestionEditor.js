import { useCallback, useEffect, useRef, useState } from 'react';

import { createContentSlug } from '../../../../shared/contracts/content-slug.js';
import { questionRequest } from './questionsApi.js';

const EMPTY = {
  title: '',
  slug: '',
  category: 'Общие вопросы',
  shortAnswer: '',
  content: '',
  seoTitle: '',
  seoDescription: '',
  primaryKeyword: '',
  keywords: [],
  authorId: 'nikolay-boykov',
  image: '',
  imageAlt: '',
  mainArticleSlug: '',
  articleSlugs: [],
  servicePath: '',
  relatedQuestionIds: [],
  indexable: true,
  pinned: false,
  showInBlog: false,
  canonical: '',
  seoReview: 'pending',
  normativeReview: 'pending',
};

export default function useQuestionEditor(id, onPublication) {
  const [record, setRecord] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [catalog, setCatalog] = useState(null);
  const [warnings, setWarnings] = useState([]);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const recordRef = useRef(null);
  const formRef = useRef(EMPTY);
  const savedRef = useRef(JSON.stringify(EMPTY));
  const queueRef = useRef(Promise.resolve());
  const slugTouchedRef = useRef(false);

  useEffect(() => {
    let active = true;
    Promise.all([
      questionRequest('/catalog'),
      id ? questionRequest(`/${encodeURIComponent(id)}`) : Promise.resolve(null),
    ])
      .then(([catalog, result]) => {
        if (!active) return;
        setCatalog(catalog);
        if (result) {
          recordRef.current = result.record;
          formRef.current = result.record.draft;
          savedRef.current = JSON.stringify(result.record.draft);
          setRecord(result.record);
          setForm(result.record.draft);
          setWarnings(result.warnings);
          slugTouchedRef.current = Boolean(result.record.draft.slug);
        }
      })
      .catch(error => {
        if (active) setError(error.message);
      });
    return () => {
      active = false;
    };
  }, [id]);

  function change(field, value) {
    if (field === 'slug') slugTouchedRef.current = true;
    const next = { ...formRef.current, [field]: value };
    if (field === 'title' && !slugTouchedRef.current && !recordRef.current?.live)
      next.slug = createContentSlug(value);
    if (
      ['title', 'shortAnswer', 'content', 'category', 'mainArticleSlug', 'servicePath'].includes(
        field,
      )
    ) {
      next.seoReview = 'pending';
      next.normativeReview = 'pending';
    }
    formRef.current = next;
    setForm(next);
  }

  const saveDirect = useCallback(async (autosave = false) => {
    const snapshot = formRef.current;
    const serialized = JSON.stringify(snapshot);
    if (recordRef.current && serialized === savedRef.current) return recordRef.current;
    if (!snapshot.title.trim()) {
      if (autosave) return recordRef.current;
      throw new Error('Заполните заголовок вопроса.');
    }
    const current = recordRef.current;
    const result = await questionRequest(current ? `/${current.id}` : '', {
      method: current ? 'PUT' : 'POST',
      body: { ...snapshot, ...(current ? { revision: current.revision, autosave } : {}) },
    });
    recordRef.current = result.record;
    setRecord(result.record);
    savedRef.current = serialized;
    if (!current)
      window.history.replaceState(null, '', `/admin/questions/edit/${result.record.id}`);
    setNotice(autosave ? 'Черновик сохранён автоматически' : 'Черновик сохранён');
    setError('');
    return result.record;
  }, []);

  const enqueue = useCallback(operation => {
    const pending = queueRef.current.then(async () => {
      setBusy(true);
      try {
        return await operation();
      } catch (error) {
        setError(error.message);
        throw error;
      } finally {
        setBusy(false);
      }
    });
    queueRef.current = pending.catch(() => {});
    return pending;
  }, []);

  const save = useCallback(
    (autosave = false) => enqueue(() => saveDirect(autosave)),
    [enqueue, saveDirect],
  );

  useEffect(() => {
    if (
      !catalog ||
      !form.title.trim() ||
      JSON.stringify(form) === savedRef.current ||
      recordRef.current?.scheduledAt
    )
      return undefined;
    const timer = window.setTimeout(() => {
      void save(true).catch(() => {});
    }, 1500);
    return () => window.clearTimeout(timer);
  }, [form, catalog, save]);

  useEffect(() => {
    const warn = event => {
      if (JSON.stringify(formRef.current) !== savedRef.current && formRef.current.title.trim()) {
        event.preventDefault();
        event.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, []);

  function action(operation, options = {}) {
    return enqueue(async () => {
      const current = await saveDirect();
      if (!current) throw new Error('Сначала заполните заголовок вопроса.');
      const inspectionBeforePublish = await questionRequest(`/${current.id}`);
      setWarnings(inspectionBeforePublish.warnings);
      const result = await questionRequest(`/${current.id}/actions`, {
        method: 'POST',
        body: { action: operation, revision: current.revision, ...options },
      });
      recordRef.current = result.record;
      formRef.current = result.record.draft;
      savedRef.current = JSON.stringify(result.record.draft);
      setRecord(result.record);
      setForm(result.record.draft);
      if (result.publication) onPublication(result.publication);
      setError('');
      setNotice(
        operation === 'publish'
          ? 'Публикация поставлена в очередь'
          : operation === 'restore'
            ? 'Версия восстановлена в черновик'
            : 'Изменения сохранены',
      );
      const inspection = await questionRequest(`/${current.id}`);
      setWarnings(inspection.warnings);
      return result.record;
    });
  }

  async function preview() {
    const tab = window.open('', '_blank');
    try {
      const current = await save();
      if (!current) throw new Error('Сначала заполните заголовок.');
      if (tab) {
        tab.opener = null;
        tab.location.href = `/admin/questions/preview/${current.id}`;
      }
    } catch (error) {
      tab?.close();
      setError(error.message);
    }
  }

  return { record, form, catalog, warnings, error, notice, busy, change, save, action, preview };
}
