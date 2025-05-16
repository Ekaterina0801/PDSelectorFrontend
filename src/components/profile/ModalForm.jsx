// components/ModalForm.jsx
import React from "react";
import Modal from "../forms/modal/Modal";
import styles from "./ModalForm.module.scss";
import { useState, useEffect } from "react";
export default function ModalForm({
  show,
  title,
  initialData = {},
  fields,
  onSave,
  onCancel,
  saveLabel = 'Сохранить',
  cancelLabel = 'Отменить',
}) {
  const [form, setForm] = useState({});

  useEffect(() => {
    if (show) {
      setForm(initialData);
    }
  }, [show, initialData]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSave(form);
  };

  if (!show) return null;

  return (
    <Modal show={show} onClose={onCancel} title={title}>
      <form className={styles.form} onSubmit={handleSubmit}>
        {fields.map(field => (
          <div key={field.name} className={styles.field}>
            <label htmlFor={field.name}>{field.label}</label>

            {field.type === 'select' ? (
              <select
                id={field.name}
                name={field.name}
                value={form[field.name] ?? ''}
                onChange={handleChange}
                required={field.required}
              >
                <option value="">—</option>
                {field.options.map(o => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            ) : field.type === 'textarea' ? (
              <textarea
                id={field.name}
                name={field.name}
                value={form[field.name] ?? ''}
                onChange={handleChange}
                required={field.required}
              />
            ) : (
              <input
                id={field.name}
                type={field.type}
                name={field.name}
                checked={field.type === 'checkbox' ? form[field.name] : undefined}
                value={field.type === 'checkbox' ? undefined : (form[field.name] ?? '')}
                onChange={handleChange}
                required={field.required}
              />
            )}
          </div>
        ))}

        <div className={styles.actions}>
          <button type="button" className={styles.btnCancel} onClick={onCancel}>
            {cancelLabel}
          </button>
          <button type="submit" className={styles.btnSave}>
            {saveLabel}
          </button>
        </div>
      </form>
    </Modal>
  );
}