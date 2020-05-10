import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ContactType, Feedback } from "../shared/feedback";
import { flyInOut, expand } from "../animations/app.animation";
import { FeedbackService } from "../services/feedback.service";

@Component({
  selector: "app-contact",
  templateUrl: "./contact.component.html",
  styleUrls: ["./contact.component.scss"],
  host: {
    "[@flyInOut]": "true",
    style: "display : block;",
  },
  animations: [flyInOut(), expand()],
})
export class ContactComponent implements OnInit {
  feedbackForm: FormGroup;
  feedback: Feedback;
  feedbackPreview: Feedback;
  @ViewChild("fform") feedbackFormDirective;
  contactType = ContactType;
  formErrors = {
    firstname: "",
    lastname: "",
    telnum: "",
    email: "",
  };

  validationMessages = {
    firstname: {
      required: "First name is required. ",
      minlength: "First name must be at least two characters long. ",
      maxlength: "First name cannot be more than 25 characters.",
    },
    lastname: {
      required: "Last name is required. ",
      minlength: "Last name must be at least two characters long. ",
      maxlength: "Last name cannot be more than 25 characters.",
    },
    telnum: {
      required: "Tel. number is required. ",
      pattern: "Tel. number should contain only numbers.",
    },
    email: {
      required: "Email is required. ",
      email: "Email not in valid format.",
    },
  };
  private spinner: boolean;

  constructor(
    private fb: FormBuilder,
    private feedbackService: FeedbackService
  ) {
    this.createForm();
  }

  ngOnInit() {}

  createForm() {
    this.feedbackForm = this.fb.group({
      firstname: [
        "",
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(25),
        ],
      ],
      lastname: [
        "",
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(25),
        ],
      ],
      telnum: ["", [Validators.required, Validators.pattern]],
      email: ["", [Validators.required, Validators.email]],
      agree: false,
      contacttype: "None",
      message: "",
    });
    this.feedbackForm.valueChanges.subscribe((data) =>
      this.onValueChanged(data)
    );
    this.onValueChanged(); //reset the form validation messages
  }

  onValueChanged(data?: any) {
    if (!this.feedbackForm) return;

    const form = this.feedbackForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous field messages if any
        this.formErrors[field] = "";
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + "";
            }
          }
        }
      }
    }
  }

  onSubmit() {
    this.spinner = true;
    //this.feedback = this.feedbackForm.value;


    this.feedbackService.submitFeedback(this.feedbackForm.value).subscribe((feedback) => {
        this.feedback = feedback;
        this.spinner = false;

        setTimeout(() => (this.feedback = null), 5000);
      });

    this.feedbackForm.reset({
      firstname: "",
      lastname: "",
      telnum: "",
      email: "",
      agree: false,
      contacttype: "None",
      message: "",
    });

  }
}
